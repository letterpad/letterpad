/* eslint-disable no-console */
//@ts-nocheck
import { getDateTime } from "@/shared/utils";

const reset = "\x1b[0m";
const bright = "\x1b[1m";

const red = "\x1b[31m";
const green = "\x1b[32m";
const blue = "\x1b[34m";
const magenta = "\x1b[35m";
const cyan = "\x1b[36m";
const orange = "\x1b[45m";

class logger {
  color = "black";

  static debug(...params: any[]) {
    const caller = getCaller();
    const [message, ...rest] = params;
    print("debug", caller, message, cyan, rest);
  }

  static info(...params: any[]) {
    const caller = getCaller();
    const [message, ...rest] = params;
    print("info", caller, message, blue, rest);
  }

  static error(...params: any[]) {
    const caller = getCaller();
    const [message, ...rest] = params;
    print("error", caller, message, red, rest);
  }

  static warning(...params: any[]) {
    const caller = getCaller();
    const [message, ...rest] = params;
    print("warn", caller, message, orange, rest);
  }

  static success(...params: any[]) {
    const caller = getCaller();
    const [message, ...rest] = params;

    print("success", caller, message, green, rest);
  }
}
export default logger;

function print(
  tagName: string,
  fileName: string,
  message: string,
  tagColor: string,
  rest: any[]
) {
  // if (process.env.DEBUG !== "true") return null;
  console.log.apply(console, [
    tagColor + bright + `[${tagName} - ${getDateTime()}]${reset}`,
    magenta + ` ${fileName}${reset}: `,
    message,
    ...rest,
  ]);
}
function getCaller() {
  try {
    throw new Error();
  } catch (e: any) {
    try {
      const getLineThree = e.stack.split("at ")[3];
      const getLastTwoSlashItem = getLineThree.split("/").slice(1).splice(-2);
      const getFileName =
        getLastTwoSlashItem[0] +
        "/" +
        getLastTwoSlashItem[1].split(":")[0].replace("?", "");
      return getFileName;
    } catch (e: any) {
      return "";
    }
  }
}
