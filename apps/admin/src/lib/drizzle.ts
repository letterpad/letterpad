import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "../../drizzle/schema";

// create database connection
const connection = connect({
  url: process.env.DRIZZLE_DATABASE_URL,
});

export const db = drizzle(connection, { schema });
