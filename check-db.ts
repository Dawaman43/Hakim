import { db } from "./src/db/client";

async function main() {
  const res = await db.execute(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'hospitals';
  `);
  console.log("Columns in hospitals table:");
  console.log(res.rows.map(r => r.column_name).join(", "));
  process.exit(0);
}

main().catch(console.error);
