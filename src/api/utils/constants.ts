import config from "../../config";

const constants = {
  SECRET: process.env.SECRET_KEY,
  LOGIN_URL: config.baseName + "/admin/login",
};

export default constants;
