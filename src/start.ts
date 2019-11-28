if (process.env.NODE_ENV === "dev") {
  require("@babel/register");
}
require("./server");
