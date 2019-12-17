const path = require("path");

const currentDir = __dirname;
export const getDirPath = (dirPath: string) => {
  return path.join(currentDir, dirPath);
};
