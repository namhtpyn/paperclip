import { applyPendingMigrations } from "./src/client.js";

const url = process.argv[2];
if (!url) {
  console.error("usage: tsx run-migrations.ts <postgres-url>");
  process.exit(1);
}
await applyPendingMigrations(url);
console.log("migrations applied");
