import { Pool } from "pg";
const CON = process.env.DATABASE_URL;
export const dBase = new Pool({
    connectionString: CON
});
