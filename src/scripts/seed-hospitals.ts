import "dotenv/config";
import { db, pool } from "../db/client";
import { hospitals, departments } from "@/db/schema";
import { MOCK_HOSPITALS } from "@/lib/mock-hospitals";

const CHUNK_SIZE = 200;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function seed() {
  console.log(`Seeding ${MOCK_HOSPITALS.length} hospitals...`);

  const hospitalRows = MOCK_HOSPITALS.map((h) => ({
    id: h.id,
    name: h.name,
    region: h.region,
    city: h.city,
    address: h.address,
    latitude: h.latitude,
    longitude: h.longitude,
    emergencyContactNumber: h.emergencyContactNumber,
    isActive: h.isActive,
    facilityType: h.facilityType,
  }));

  let batchIndex = 0;
  const hospitalBatches = chunk(hospitalRows, CHUNK_SIZE);
  for (const batch of hospitalBatches) {
    await db.insert(hospitals).values(batch).onConflictDoNothing();
    batchIndex += 1;
    if (batchIndex % 5 === 0 || batchIndex === hospitalBatches.length) {
      console.log(`Hospitals: ${Math.min(batchIndex * CHUNK_SIZE, hospitalRows.length)}/${hospitalRows.length}`);
    }
  }

  const departmentRows = MOCK_HOSPITALS.flatMap((h) =>
    h.departments.map((d, i) => ({
      id: `dept-${h.id}-${i}`,
      hospitalId: h.id,
      name: d.name,
      description: `${d.name} department`,
      averageServiceTimeMin: d.avgTime,
      dailyCapacity: d.capacity,
      currentQueueCount: 0,
      isActive: true,
    }))
  );

  batchIndex = 0;
  const departmentBatches = chunk(departmentRows, CHUNK_SIZE);
  for (const batch of departmentBatches) {
    await db.insert(departments).values(batch).onConflictDoNothing();
    batchIndex += 1;
    if (batchIndex % 10 === 0 || batchIndex === departmentBatches.length) {
      console.log(`Departments: ${Math.min(batchIndex * CHUNK_SIZE, departmentRows.length)}/${departmentRows.length}`);
    }
  }

  console.log("Seed complete.");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
