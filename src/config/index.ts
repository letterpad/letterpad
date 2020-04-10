import configDev from "./config.dev";
import configProd from "./config.prod";
import logger from "../shared/logger";

let currentEnv =
  typeof window !== "undefined"
    ? (window as any).NODE_ENV
    : process.env.NODE_ENV;

let currentTheme =
  typeof window !== "undefined" ? (window as any).THEME : process.env.THEME;

if (!currentEnv) currentEnv = "test";

const configFile = currentEnv === "production" ? configProd : configDev;

const config = {
  NODE_ENV: currentEnv,
  API_URL: configFile.API_URL,
  ROOT_URL: configFile.ROOT_URL,
  UPLOAD_URL: configFile.UPLOAD_URL,
  APP_PORT: configFile.APP_PORT,
  rssPath: "rss.xml",
  defaultTitle: "Untitled",
  defaultSlug: "story",
  adminPath: "/admin",
  itemsPerPage: 6,
  mediaPerPage: 20,
  BASE_NAME: configFile.BASE_NAME,
  //@ts-ignore
  THEME: currentTheme,
};

logger.debug("Using config => ", config);

export default config;
