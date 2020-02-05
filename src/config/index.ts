import configDev from "./config.dev";
import configProd from "./config.prod";

let currentEnv =
  typeof window !== "undefined"
    ? (window as any).NODE_ENV
    : process.env.NODE_ENV;

if (!currentEnv) currentEnv = "test";

const configFile = currentEnv === "production" ? configProd : configDev;

const config = {
  apiUrl: configFile.apiUrl,
  ROOT_URL: configFile.ROOT_URL,
  uploadUrl: configFile.uploadUrl,
  appPort: configFile.appPort,
  defaultTitle: "Untitled",
  defaultSlug: "story",
  adminPath: "/admin",
  itemsPerPage: 6,
  mediaPerPage: 20,
  baseName: configFile.baseName,
};

export default config;
