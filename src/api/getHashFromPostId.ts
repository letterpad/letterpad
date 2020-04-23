import { Response } from "express";
import { encrypt } from "./utils/crypto";

export const getHashFromPostId = async (req, res: Response) => {
  if (!req.user || !req.user.id) return res.status(401).send("Unauthorized");
  res.send(encrypt(req.query.id.toString()));
};
