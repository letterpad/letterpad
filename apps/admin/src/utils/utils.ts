const convertInitialsToUpperCase = (sentence: string) => {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const isSqliteDb = () => {
  return process.env.DATABASE_URL?.startsWith("file");
};
