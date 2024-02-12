export const isSqliteDb = () => {
  return process.env.DATABASE_URL?.startsWith("file");
};
