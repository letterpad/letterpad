const multer = require("multer");
const path = require("path");
const customStorage = require("./utils/customStorage");

var upload = multer({
    storage: new customStorage({
        destination: function(req, file, cb) {
            let fname = Date.now() + ".jpg";
            cb(null, path.join(__dirname, "../public/uploads/", fname));
        },
        filename: function(req, file, cb) {
            cb(null, Date.now());
        }
    }),
    limits: { fileSize: 5000000 }
});

module.exports = upload;
