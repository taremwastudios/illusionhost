import { runMigrations } from "@kilocode/app-builder-db";
import { db } from "./index";

if (!db) {
  console.log("No database configured, skipping migrations");
  process.exit(0);
}

await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });
