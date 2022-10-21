const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.SECRET || "";

export function encryptEmail(text: string) {
  const bufferObj = Buffer.from(text + ENCRYPTION_KEY, "utf8");

  return bufferObj.toString("base64");
}

export function decryptEmail(text) {
  const bufferObj = Buffer.from(text, "base64");

  // Decoding base64 into String
  return bufferObj.toString("utf8").replace(ENCRYPTION_KEY, "");
}
