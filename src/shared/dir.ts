import { lstatSync, readdirSync } from "fs";
import { join } from "path";

const isDirectory = source => lstatSync(source).isDirectory();

export const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);
