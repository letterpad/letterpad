const { spawn } = require("child_process");

const types = {
  text: "text",
  progress: "progress",
};
const isProduction = process.env.NODE_ENV === "production";

const hasValidLink = chunk => {
  const data = chunk.toString("utf8");
  const dataArr = data.split(" ");
  if (data.length >= 3) {
    const url = dataArr[2];
    if (url && url.toString().indexOf("http") >= 0) {
      return true;
    }
  }
  return false;
};

module.exports.generateStaticAssets = async (req, res) => {
  try {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    if (!isProduction) {
      return res.end(
        JSON.stringify({
          type: types.text,
          message: "Cannot process this request in non production mode",
        }),
      );
    }
    const testscript = spawn("./admin/static-generator/generate.sh");
    const totalLinks = 700;
    const percentageOfOneChunk = 100 / totalLinks;
    let progress = 0;
    testscript.stdout.on("data", chunk => {
      if (hasValidLink(chunk)) {
        progress += percentageOfOneChunk;
        res.write(JSON.stringify({ type: types.progress, message: progress }));
      }
    });

    testscript.stderr.on("data", error => {
      delete process.env.MODE;
      res.end(JSON.stringify({ type: types.text, message: error.message }));
    });

    testscript.on("close", () => {
      delete process.env.MODE;
      res.end(JSON.stringify({ type: types.progress, message: 100 }));
    });
  } catch (error) {
    res.end(JSON.stringify({ type: types.text, message: error.message }));
  }
};

module.exports.createPullRequest = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  const exec = require("child_process").exec;
  const testscript = exec("sh ./admin/static-generator/createPr.sh");

  testscript.stdout.on("data", chunk => {
    const data = chunk.toString("utf8");
    res.write(JSON.stringify({ type: types.text, message: data }));
  });

  testscript.on("data", function(err) {
    res.end(JSON.stringify({ type: types.text, message: err.message }));
  });

  testscript.on("close", function() {
    res.end(JSON.stringify({ type: types.text, message: "done" }));
  });
};
