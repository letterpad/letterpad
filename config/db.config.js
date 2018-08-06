const path = require("path");

const getFile = name => {
    const dbFile = name + ".sqlite";
    return path.join(__dirname, "../data/", dbFile);
};
module.exports = {
    dev: {
        username: "root",
        password: null,
        database: "letterpad_demo",
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: getFile("letterpad_demo"),
        logging: false,
        define: {
            underscored: true
        }
    },
    test: {
        username: "root",
        password: null,
        database: "test",
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: getFile("test"),
        logging: false,
        define: {
            underscored: true
        }
    },
    production: {
        username: "root",
        password: null,
        database: "letterpad_demo",
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: getFile("letterpad_demo"),
        logging: false,
        define: {
            underscored: true
        }
    }
};
