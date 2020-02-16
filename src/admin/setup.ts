import { Request, Response } from "express";
import { getFile } from "../config/db.config";
import { promises as fs } from "fs";
import { seed } from "../api/seed/seed";
import models from "../api/models";

export function setupLetterpad(req: Request, res: Response) {
  handleSetup()
    .then(({ message }) => {
      res.end(message);
    })
    .catch(e => {
      res.statusCode = 500;
      console.error(e);
      res.end(`
Seed unsuccessful: ${e.message}

${e.stack}
`);
    });
}

async function handleSetup() {
  /**
   * Check db file exists
   */
  const dbfile = getFile("letterpad");

  if (!(await isFile(dbfile))) {
    await seed(models, false);
    return {
      message: "Seed Successful",
    };
  }

  return {
    message: "Seed not required. DB Exists",
  };
}

async function isFile(path: string) {
  try {
    const stat = await fs.lstat(path);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}
