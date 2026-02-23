import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "";

    const providers = [
      { name: "ipapi", url: ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/" },
      { name: "ipinfo", url: ip ? `https://ipinfo.io/${ip}/json` : "https://ipinfo.io/json" },
      { name: "ipwhois", url: ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/" },
      { name: "ip-api", url: ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json" },
    ];

    for (const provider of providers) {
      try {
        const res = await fetch(provider.url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();

        if (provider.name === "ipapi") {
          if (typeof data?.latitude === "number" && typeof data?.longitude === "number") {
            return NextResponse.json({
              latitude: data.latitude,
              longitude: data.longitude,
              city: data.city,
              source: "ipapi",
            });
          }
        }

        if (provider.name === "ipinfo" && typeof data?.loc === "string") {
          const [lat, lng] = data.loc.split(",").map(Number);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return NextResponse.json({
              latitude: lat,
              longitude: lng,
              city: data.city,
              source: "ipinfo",
            });
          }
        }

        if (provider.name === "ipwhois") {
          const lat = Number(data?.latitude);
          const lng = Number(data?.longitude);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return NextResponse.json({
              latitude: lat,
              longitude: lng,
              city: data?.city,
              source: "ipwhois",
            });
          }
        }

        if (provider.name === "ip-api") {
          const lat = Number(data?.lat);
          const lng = Number(data?.lon);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return NextResponse.json({
              latitude: lat,
              longitude: lng,
              city: data?.city,
              source: "ip-api",
            });
          }
        }
      } catch {
        // try next provider
      }
    }

    return NextResponse.json({ error: "Unable to determine location" }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ error: "Location lookup failed" }, { status: 500 });
  }
}
