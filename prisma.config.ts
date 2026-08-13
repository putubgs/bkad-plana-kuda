import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `prisma generate` loads this file but does not connect to the database.
 * `env("DATABASE_URL")` throws if the var is missing, which breaks Docker
 * builds (compose only injects DATABASE_URL at container runtime).
 * Prefer DATABASE_URL when set; otherwise compose it from POSTGRES_*.
 */
function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = process.env.POSTGRES_USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD ?? "password";
  const database = process.env.POSTGRES_DB ?? "db_plana_kuda";
  const host = process.env.POSTGRES_HOST ?? "localhost";

  return `postgresql://${user}:${password}@${host}:5432/${database}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
