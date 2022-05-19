import { exec } from "child_process";
import * as util from "util";

const execPromisify = util.promisify(exec);

export const execShell = async (command: string) => execPromisify(command);
