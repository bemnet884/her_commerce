import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: "postgresql://postgres:root@localhost:5432/hercommerce",
  },
});
