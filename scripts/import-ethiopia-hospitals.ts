import "dotenv/config";
import { db, pool } from "../src/db/client";
import { hospitals } from "../src/db/schema";
import fs from "node:fs/promises";

type GeoJsonGeometry = {
  type: string;
  coordinates: any;
};

type GeoJsonFeature = {
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry?: GeoJsonGeometry | null;
};

type GeoJson = {
  type: string;
  features?: GeoJsonFeature[];
};

const DEFAULT_URLS = [
  "https://www.ethionsdi.gov.et/geoserver/wfs?outputFormat=json&request=GetFeature&service=WFS&srsName=EPSG:4326&typename=geonode:primary_hosp&version=1.0.0",
];

const SOURCE_PREFIX = process.env.SOURCE_PREFIX?.trim() || "ethio";
const DATASET_URLS = (process.env.DATASET_URLS || "").split(",").map((u) => u.trim()).filter(Boolean);
const HDX_DATASET_IDS = (process.env.HDX_DATASET_IDS || "").split(",").map((u) => u.trim()).filter(Boolean);

const CHUNK_SIZE = 300;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function norm(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}

function pickProp(props: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    if (key in props) {
      const value = norm(props[key]);
      if (value) return value;
    }
  }
  return null;
}

function pickByRegex(props: Record<string, unknown>, regexes: RegExp[]): string | null {
  for (const [key, value] of Object.entries(props)) {
    for (const regex of regexes) {
      if (regex.test(key)) {
        const cleaned = norm(value);
        if (cleaned) return cleaned;
      }
    }
  }
  return null;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        field += "\"";
        i += 1;
        continue;
      }
      if (char === "\"") {
        inQuotes = false;
        continue;
      }
      field += char;
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") continue;
    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function parseWktPoint(value: string): { lat: number; lng: number } | null {
  const match = value.match(/POINT\\s*\\(\\s*([\\d.+-]+)\\s+([\\d.+-]+)\\s*\\)/i);
  if (!match) return null;
  const lng = Number(match[1]);
  const lat = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function extractLatLngFromProps(props: Record<string, unknown>): { lat: number; lng: number } | null {
  const latKey = Object.keys(props).find((key) => /lat/i.test(key));
  const lngKey = Object.keys(props).find((key) => /lon|lng|long/i.test(key));

  const latValue = latKey ? Number(props[latKey]) : NaN;
  const lngValue = lngKey ? Number(props[lngKey]) : NaN;
  if (Number.isFinite(latValue) && Number.isFinite(lngValue)) {
    return { lat: latValue, lng: lngValue };
  }

  const wktKey = Object.keys(props).find((key) => /geom|geometry|wkt/i.test(key));
  if (wktKey) {
    const parsed = parseWktPoint(String(props[wktKey]));
    if (parsed) return parsed;
  }

  return null;
}

function extractLatLng(geometry?: GeoJsonGeometry | null): { lat: number; lng: number } | null {
  if (!geometry || !geometry.coordinates) return null;
  const coords = geometry.coordinates;
  const type = geometry.type;

  const pointFromPair = (pair: any): { lat: number; lng: number } | null => {
    if (!Array.isArray(pair) || pair.length < 2) return null;
    const lng = Number(pair[0]);
    const lat = Number(pair[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  };

  if (type === "Point") return pointFromPair(coords);
  if (type === "MultiPoint") return pointFromPair(coords?.[0]);
  if (type === "LineString") return pointFromPair(coords?.[0]);

  const centroid = (points: any[]): { lat: number; lng: number } | null => {
    if (!Array.isArray(points) || points.length === 0) return null;
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;
    for (const pair of points) {
      const p = pointFromPair(pair);
      if (!p) continue;
      sumLat += p.lat;
      sumLng += p.lng;
      count += 1;
    }
    if (count === 0) return null;
    return { lat: sumLat / count, lng: sumLng / count };
  };

  if (type === "Polygon") return centroid(coords?.[0] || []);
  if (type === "MultiPolygon") return centroid(coords?.[0]?.[0] || []);
  return null;
}

function normalizeFacilityType(raw: string | null): string {
  if (!raw) return "HOSPITAL";
  const value = raw.toLowerCase();
  if (value.includes("health post")) return "HEALTH_POST";
  if (value.includes("health center") || value.includes("health centre")) return "HEALTH_CENTER";
  if (value.includes("clinic")) return "CLINIC";
  if (value.includes("pharmacy")) return "PHARMACY";
  if (value.includes("laboratory") || value.includes("lab")) return "LABORATORY";
  if (value.includes("specialized") || value.includes("specialised")) return "SPECIALIZED_CENTER";
  if (value.includes("hospital")) return "HOSPITAL";
  return "HOSPITAL";
}

function makeKey(name: string, region: string, city: string | null): string {
  return `${name.toLowerCase()}|${region.toLowerCase()}|${(city || "").toLowerCase()}`;
}

async function loadExistingKeys(): Promise<Set<string>> {
  const rows = await db.select({ name: hospitals.name, region: hospitals.region, city: hospitals.city }).from(hospitals);
  return new Set(rows.map((row) => makeKey(row.name, row.region, row.city)));
}

async function fetchGeoJson(source: string): Promise<GeoJson> {
  if (/^https?:/i.test(source)) {
    const res = await fetch(source, {
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${source}: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<GeoJson>;
  }

  const filePath = source.replace(/^file:/i, "");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as GeoJson;
}

async function fetchText(source: string): Promise<string> {
  if (/^https?:/i.test(source)) {
    const res = await fetch(source, {
      headers: { "Accept": "text/plain,*/*" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${source}: ${res.status} ${res.statusText}`);
    }
    return res.text();
  }
  const filePath = source.replace(/^file:/i, "");
  return fs.readFile(filePath, "utf8");
}

async function resolveHdxResourceUrls(datasetId: string): Promise<string[]> {
  const apiUrl = `https://data.humdata.org/api/3/action/package_show?id=${encodeURIComponent(datasetId)}`;
  const res = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    throw new Error(`Failed to fetch HDX dataset ${datasetId}: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { success?: boolean; result?: { resources?: Array<Record<string, unknown>> } };
  const resources = json.result?.resources || [];
  const urls: string[] = [];

  for (const resource of resources) {
    const format = norm(resource.format) || "";
    const url = norm(resource.url);
    const name = norm(resource.name) || "";
    const lower = `${format} ${name} ${url || ""}`.toLowerCase();
    if (!url) continue;
    if (
      lower.includes("geojson") ||
      lower.includes(".geojson") ||
      lower.includes("json") ||
      lower.includes("csv") ||
      lower.includes(".csv")
    ) {
      urls.push(url);
    }
  }

  return urls;
}

async function importGeoJson(source: string, existingKeys: Set<string>) {
  console.log(`Fetching ${source}`);
  const isCsv = /\\.csv/i.test(source) || /format=csv/i.test(source);
  console.log(`Detected CSV: ${isCsv}`);
  let features: GeoJsonFeature[] = [];
  let csvRows: Array<Record<string, unknown>> = [];

  if (isCsv) {
    const raw = await fetchText(source);
    const rows = parseCsv(raw);
    const headers = rows.shift()?.map((h) => h.trim()) || [];
    csvRows = rows
      .filter((row) => row.length > 0)
      .map((row) => {
        const entry: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          entry[header] = row[index];
        });
        return entry;
      });
    console.log(`Found ${csvRows.length} CSV rows`);
  } else {
    try {
      const data = await fetchGeoJson(source);
      features = data.features || [];
      console.log(`Found ${features.length} features`);
    } catch (err) {
      if (/csv/i.test(source)) {
        const raw = await fetchText(source);
        const rows = parseCsv(raw);
        const headers = rows.shift()?.map((h) => h.trim()) || [];
        csvRows = rows
          .filter((row) => row.length > 0)
          .map((row) => {
            const entry: Record<string, unknown> = {};
            headers.forEach((header, index) => {
              entry[header] = row[index];
            });
            return entry;
          });
        console.log(`Found ${csvRows.length} CSV rows`);
      } else {
        throw err;
      }
    }
  }

  const rows = [] as Array<{
    id: string;
    name: string;
    region: string;
    city: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    emergencyContactNumber: string | null;
    isActive: boolean;
    facilityType: string;
  }>;

  const seen = new Set<string>();

  if (csvRows.length > 0) {
    for (let i = 0; i < csvRows.length; i += 1) {
      const props = csvRows[i];

      const name =
        pickProp(props, ["name", "name_en", "hospital", "hospital_name", "hosp_name", "facility", "facility_name", "health_facility", "health_fac", "org_name", "site_name"]) ||
        pickByRegex(props, [/hosp/i, /facility/i, /health/i, /name/i]);
      if (!name) continue;

      const region =
        pickProp(props, ["region", "region_name", "adm1", "adm1_en", "admin1", "admin1_name", "regionname"]) ||
        pickByRegex(props, [/region/i, /adm1/i, /admin1/i]);
      if (!region) continue;

      const city =
        pickProp(props, ["city", "town", "woreda", "adm2", "adm2_en", "admin2", "zone", "subcity", "locality"]) ||
        pickByRegex(props, [/city/i, /woreda/i, /adm2/i, /zone/i]);

      const address =
        pickProp(props, ["address", "addr", "location", "loc_name", "kebele", "subcity", "town"]) ||
        (city ? `${city}, ${region}, Ethiopia` : `${region}, Ethiopia`);

      const facilityTypeRaw =
        pickProp(props, ["facility_type", "facility_t", "type", "category", "ftype", "service"]) ||
        pickByRegex(props, [/facility/i, /type/i, /category/i]);

      const facilityType = normalizeFacilityType(facilityTypeRaw);

      const emergencyContactNumber =
        pickProp(props, ["phone", "tel", "telephone", "contact", "emergency", "contact_no", "mobile"]) || null;

      const coords = extractLatLngFromProps(props);
      const latitude = coords?.lat ?? null;
      const longitude = coords?.lng ?? null;

      const key = makeKey(name, region, city || null);
      if (existingKeys.has(key) || seen.has(key)) continue;
      seen.add(key);

      const id = `${SOURCE_PREFIX}-csv-${i}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;

      rows.push({
        id,
        name,
        region,
        city: city || null,
        address,
        latitude,
        longitude,
        emergencyContactNumber,
        isActive: true,
        facilityType,
      });
    }
  } else {
    for (let i = 0; i < features.length; i += 1) {
      const feature = features[i];
      const props = (feature.properties || {}) as Record<string, unknown>;

      const name =
        pickProp(props, ["name", "name_en", "hospital", "hospital_name", "hosp_name", "facility", "facility_name", "health_facility", "health_fac", "org_name", "site_name"]) ||
        pickByRegex(props, [/hosp/i, /facility/i, /health/i, /name/i]);
      if (!name) continue;

      const region =
        pickProp(props, ["region", "region_name", "adm1", "adm1_en", "admin1", "admin1_name", "regionname"]) ||
        pickByRegex(props, [/region/i, /adm1/i, /admin1/i]);
      if (!region) continue;

      const city =
        pickProp(props, ["city", "town", "woreda", "adm2", "adm2_en", "admin2", "zone", "subcity", "locality"]) ||
        pickByRegex(props, [/city/i, /woreda/i, /adm2/i, /zone/i]);

      const address =
        pickProp(props, ["address", "addr", "location", "loc_name", "kebele", "subcity", "town"]) ||
        (city ? `${city}, ${region}, Ethiopia` : `${region}, Ethiopia`);

      const facilityTypeRaw =
        pickProp(props, ["facility_type", "facility_t", "type", "category", "ftype", "service"]) ||
        pickByRegex(props, [/facility/i, /type/i, /category/i]);

      const facilityType = normalizeFacilityType(facilityTypeRaw);

      const emergencyContactNumber =
        pickProp(props, ["phone", "tel", "telephone", "contact", "emergency", "contact_no", "mobile"]) || null;

      const coords = extractLatLng(feature.geometry || null);
      const latitude = coords?.lat ?? null;
      const longitude = coords?.lng ?? null;

      const key = makeKey(name, region, city || null);
      if (existingKeys.has(key) || seen.has(key)) continue;
      seen.add(key);

      const id = `${SOURCE_PREFIX}-${feature.id ?? i}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;

      rows.push({
        id,
        name,
        region,
        city: city || null,
        address,
        latitude,
        longitude,
        emergencyContactNumber,
        isActive: true,
        facilityType,
      });
    }
  }

  if (rows.length === 0) {
    console.log("No new hospitals to insert.");
    return { inserted: 0, processed: features.length };
  }

  let inserted = 0;
  const batches = chunk(rows, CHUNK_SIZE);
  for (const batch of batches) {
    await db.insert(hospitals).values(batch).onConflictDoNothing();
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${rows.length}`);
  }

  return { inserted, processed: features.length };
}

async function main() {
  let urls: string[] = [];

  if (DATASET_URLS.length > 0) {
    urls = [...DATASET_URLS];
  } else if (HDX_DATASET_IDS.length > 0) {
    for (const datasetId of HDX_DATASET_IDS) {
      try {
        const hdxUrls = await resolveHdxResourceUrls(datasetId);
        if (hdxUrls.length === 0) {
          console.warn(`No CSV/GeoJSON resources found for HDX dataset ${datasetId}.`);
        } else {
          urls.push(...hdxUrls);
        }
      } catch (err) {
        console.warn(`Failed to resolve HDX dataset ${datasetId}.`, err);
      }
    }
  } else {
    urls = [...DEFAULT_URLS];
  }

  if (urls.length === 0) {
    console.warn("No datasets resolved. Provide DATASET_URLS or HDX_DATASET_IDS.");
    return;
  }

  console.log(`Importing hospitals from ${urls.length} dataset(s).`);
  const existingKeys = await loadExistingKeys();

  let totalInserted = 0;
  let totalProcessed = 0;

  for (const url of urls) {
    const result = await importGeoJson(url, existingKeys);
    totalInserted += result.inserted;
    totalProcessed += result.processed;
  }

  console.log(`Done. Processed ${totalProcessed} features. Inserted ${totalInserted} new hospitals.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
