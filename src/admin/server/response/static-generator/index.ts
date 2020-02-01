const path = require("path");
var fs = require("fs");
const types = {
  text: "text",
  progress: "progress",
};
const isProduction = process.env.NODE_ENV === "production";

export const generateStaticAssets = async (req, res) => {
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

    const scrape = require("website-scraper");
    const staticFolder = path.join(__dirname, "../../letterpad-static");
    deleteFolderRecursive(staticFolder);
    await scrape({
      urls: [process.env.rootUrl],
      urlFilter: url => url.startsWith(process.env.rootUrl), // Filter links to other websites
      recursive: true,
      maxRecursiveDepth: 10,
      filenameGenerator: "bySiteStructure",
      directory: staticFolder,
      request: {
        headers: {
          static: true,
        },
      },
    });

    res.end(JSON.stringify({ type: types.text, message: "done" }));

    // res.end(JSON.stringify({ type: types.progress, message: 100 }));
  } catch (error) {
    res.end(JSON.stringify({ type: types.text, message: error.message }));
  }
};

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
