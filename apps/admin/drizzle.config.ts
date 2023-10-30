require("dotenv/config");
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    driver: "mysql2",
    introspect:{casing:"preserve"},
    dbCredentials: {
        connectionString: process.env.DRIZZLE_DATABASE_URL! //process.env.DATABASE_URL!,
    }
// eslint-disable-next-line prettier/prettier
} satisfies Config;