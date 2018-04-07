const fs = require("fs");

fs
    .createReadStream(__dirname + "/../sample.env")
    .pipe(fs.createWriteStream(__dirname + "/../.env"));
