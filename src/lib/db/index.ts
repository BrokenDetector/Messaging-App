import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	console.error("❌ Error: Database URL is not specified in the environment variables.");
	process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

console.log("Database connection successfully established.");
