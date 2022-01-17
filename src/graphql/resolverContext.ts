import { SessionData } from "./types";
import { IncomingMessage, ServerResponse } from "http";
// import { ModelsType } from "./db/models/index2";

export type ResolverContext = {
  req?: IncomingMessage;
  res?: ServerResponse;
  models: any;
  session?: { user: SessionData };
  author_id?: number;
};
