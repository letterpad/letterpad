import logger from "./../../shared/logger";
const ENCRYPTION_KEY = process.env.SECRET_KEY;

if (!ENCRYPTION_KEY) {
  logger.error("Missong SECRET_KEY in .env file");
}
export function encrypt(text: string) {
  return Buffer.from(text + ENCRYPTION_KEY).toString("base64");
}

export function decrypt(text: string) {
  return Buffer.from(text, "base64")
    .toString("ascii")
    .replace(ENCRYPTION_KEY, "");
}
