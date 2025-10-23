import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: "postgresql://postgres:root@localhost:5432/hercommerce",
});

const db = drizzle(pool, { schema });

export default db;
