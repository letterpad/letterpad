import type { Config } from "drizzle-kit";

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    driver: "mysql2",
    dbCredentials: {
        connectionString: `mysql://0mgsfv5qhs8l8spiid6w:pscale_pw_BD6ozhXhexLmKsLPPmcjT6OhjpE6hygdeJtLNtxvZSa@aws.connect.psdb.cloud/letterpad?ssl={"rejectUnauthorized":true}` //process.env.DATABASE_URL!,
    }
// eslint-disable-next-line prettier/prettier
} satisfies Config;