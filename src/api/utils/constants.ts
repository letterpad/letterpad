import config from "../../config";

const constants = {
  SECRET: process.env.SECRET_KEY,
  LOGIN_URL: config.BASE_NAME + "/admin/login",
};

export default constants;
