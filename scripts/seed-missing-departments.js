/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");

const DEFAULT_DEPARTMENTS = {
  HOSPITAL: [
    { name: "General Medicine", avg: 15, capacity: 80 },
    { name: "Pediatrics", avg: 20, capacity: 60 },
    { name: "Maternity", avg: 25, capacity: 50 },
    { name: "Emergency", avg: 10, capacity: 120 },
    { name: "Laboratory", avg: 8, capacity: 100 },
    { name: "Pharmacy", avg: 6, capacity: 140 },
  ],
  HEALTH_CENTER: [
    { name: "General Medicine", avg: 15, capacity: 60 },
    { name: "Pediatrics", avg: 20, capacity: 40 },
    { name: "Maternity", avg: 25, capacity: 35 },
    { name: "Laboratory", avg: 8, capacity: 50 },
    { name: "Pharmacy", avg: 6, capacity: 70 },
  ],
  CLINIC: [
    { name: "General Medicine", avg: 15, capacity: 40 },
    { name: "Pediatrics", avg: 20, capacity: 25 },
    { name: "Maternity", avg: 25, capacity: 20 },
  ],
  HEALTH_POST: [
    { name: "General Medicine", avg: 15, capacity: 30 },
    { name: "Maternity", avg: 25, capacity: 20 },
  ],
  PHARMACY: [
    { name: "Pharmacy", avg: 6, capacity: 120 },
  ],
  LABORATORY: [
    { name: "Laboratory", avg: 8, capacity: 80 },
  ],
  SPECIALIZED_CENTER: [
    { name: "General Medicine", avg: 15, capacity: 50 },
    { name: "Specialty Care", avg: 20, capacity: 40 },
    { name: "Laboratory", avg: 8, capacity: 60 },
  ],
};

function pickDepartments(facilityType) {
  return DEFAULT_DEPARTMENTS[facilityType] || DEFAULT_DEPARTMENTS.HEALTH_CENTER;
}

function uuid() {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : require("uuid").v4();
}

async function main() {
  const connectionString = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL or DATABASE_URL_DIRECT");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    family: 4,
    connectionTimeoutMillis: 10000,
  });

  const client = await pool.connect();
  try {
    const { rows: hospitals } = await client.query(`
      select h.id, h.name, h.facility_type as "facilityType",
             count(d.id)::int as "deptCount"
      from hospitals h
      left join departments d on d.hospital_id = h.id
      group by h.id
      having count(d.id) = 0
      order by h.name
    `);

    if (hospitals.length === 0) {
      console.log("No hospitals missing departments.");
      return;
    }

    let inserted = 0;
    for (const hospital of hospitals) {
      const list = pickDepartments(hospital.facilityType);
      for (const dept of list) {
        await client.query(
          `insert into departments (id, hospital_id, name, description, average_service_time_min, daily_capacity, current_queue_count, is_active)
           values ($1, $2, $3, $4, $5, $6, 0, true)`,
          [
            uuid(),
            hospital.id,
            dept.name,
            `${dept.name} services`,
            dept.avg,
            dept.capacity,
          ]
        );
        inserted += 1;
      }
    }

    console.log(`Seeded ${inserted} departments for ${hospitals.length} hospitals.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
