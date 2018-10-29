const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const constants = require("./utils/constants");

const corsMiddleWare = cors({
  exposedHeaders: ["x-refresh-token"],
});
const bodyParserMiddleWare = bodyParser.urlencoded({
  extended: true,
});

/**
 * For every request from dashboard, we will keep updating the token with the expiry date.
 * This is useful in logging out the user due to inactivity.
 */
const addAdminToken = async (req, res) => {
  const token = req.headers["authorization"];
  delete req.user;
  const operationName = req.body.operationName;

  if (operationName === "getOptions") {
    return req.next();
  }

  if (token && token != "null") {
    try {
      const data = await jwt.verify(token, constants.SECRET);
      req.user = { ...data };
      // while generating the new token we dont need the below data. This gets attached by jwt automatically.
      delete data.iat;
      delete data.exp;

      const newToken = jwt.sign(data, constants.SECRET, {
        expiresIn: req.user.expiresIn,
      });
      res.setHeader("x-refresh-token", newToken);
    } catch (error) {
      console.log("Invalid token or token expired");
      res.status(401);
      res.set("Location", constants.LOGIN_URL);
    }
  }
  req.next();
};

module.exports = function(app) {
  app.use(corsMiddleWare);
  app.options("*", cors());
  app.use(bodyParserMiddleWare);
  app.use(bodyParser.json());
  app.use(addAdminToken);
};
