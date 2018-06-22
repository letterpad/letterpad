var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "dev";
var config = require("../../config/db.config.js")[env];
var db = {};
var conn = null;

// establish  database connection
conn = new Sequelize(config.database, config.username, config.password, config);

// read the current folder and get all the files (models) except this one
// loop though the files and import them through sequelize to get an instance of all models
fs.readdirSync(__dirname)
    .filter(function(file) {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
        );
    })
    .forEach(function(file) {
        var model = conn["import"](path.join(__dirname, file));
        var name = model.name.charAt(0).toUpperCase() + model.name.slice(1);
        db[name] = model;
    });

// now that we have the model instances, add relationships
Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = conn;
db.Sequelize = Sequelize;

module.exports = db;
