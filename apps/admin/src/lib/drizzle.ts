import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "../../drizzle/schema";

// create database connection
const connection = connect({
  url: "mysql://0mgsfv5qhs8l8spiid6w:pscale_pw_BD6ozhXhexLmKsLPPmcjT6OhjpE6hygdeJtLNtxvZSa@aws.connect.psdb.cloud/letterpad?sslaccept=strict",
});

export const db = drizzle(connection, { schema, mode: "planetscale" });
