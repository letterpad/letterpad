class logger {
  color = "black";

  static debug(...params: any[]) {
    const [message, ...rest] = params;
    print("LOG", message, "\x1b[36m%s", rest);
  }

  static info(...params: any[]) {
    const [message, ...rest] = params;
    print("INFO", message, "\x1b[34m", rest);
  }

  static error(...params: any[]) {
    const [message, ...rest] = params;
    print("ERROR", message, "\x1b[31m", rest);
  }

  static warning(...params: any[]) {
    const [message, ...rest] = params;
    print("WARN", message, "\x1b[45m", rest);
  }

  static success(...params: any[]) {
    const [message, ...rest] = params;
    print("SUCCESS", message, "\x1b[42m", rest);
  }
}
export default logger;

function print(
  tagName: string,
  message: string,
  tagColor: string,
  rest: any[],
) {
  console.log.apply(console, [
    tagColor,
    `[${tagName}]\x1b[0m:`,
    message,
    ...rest,
  ]);
}
