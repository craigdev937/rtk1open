import { Pool } from "pg";
const CON = process.env.DATABASE_URL;

export const dBase: Pool = new Pool({
    connectionString: CON
});



