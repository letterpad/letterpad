import { Express, NextFunction, Request, Response } from "express";

import { ITokenData } from "../types/types";
import constants from "./utils/constants";
import cors from "cors";

const jwt = require("jsonwebtoken");
const corsMiddleWare = cors({
  exposedHeaders: ["x-refresh-token"],
});

/**
 * For every request from dashboard, we will keep updating the token with the expiry date.
 * This is useful in logging out the user due to inactivity.
 */

const addRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  delete req.user;
  const operationName = req.body && req.body.operationName;
  if (operationName === "settings" || operationName === "login") {
    return next();
  }
  if (!token) return next();
  try {
    const { iat, exp, ...data }: ITokenData = await jwt.verify(
      token,
      constants.SECRET,
    );
    req.user = data;

    const newToken: string = jwt.sign(data, constants.SECRET, {
      expiresIn: req.user.expiresIn,
    });
    res.setHeader("x-refresh-token", newToken);
  } catch (error) {
    console.log("Invalid token or token expired");
    res.status(401);
    res.set("Location", constants.LOGIN_URL);
  }
  next();
};

export default function(app: Express) {
  app.use(corsMiddleWare);
  app.options("*", cors());
  app.use(addRefreshToken);
}
