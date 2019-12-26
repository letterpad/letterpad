class log {
  color = "black";

  constructor(message: string) {
    print("LOG", message, "darkcyan");
  }

  static info(message: string) {
    print("INFO", message, "Blue");
  }

  static error(message: string) {
    print("ERROR", message, "Red");
  }

  static warning(message: string) {
    print("WARN", message, "Orange");
  }

  static success(message: string) {
    print("SUCCESS", message, "Green");
  }
}
export default log;

function print(tagName: string, tagColor: string, message: string) {
  console.log(
    `%c[${tagName}]  %c${message}`,
    `color:${tagColor};font-weight:bold`,
    `color:black`,
  );
}
