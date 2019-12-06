import { IS_AUTHORIZED } from "./../../../shared/queries/Queries";
import { Request, Response } from "express";
import { generateStaticAssets } from "./static-generator";
import { validateToken } from "../../../shared/queries/types/validateToken";
import apolloClient from "../../../shared/apolloClient";
import { clientOpts } from "..";

export const generateStaticSite = async (req: Request, res: Response) => {
  try {
    const client = await apolloClient(
      true,
      clientOpts,
      req.headers.token as string,
    ).query<validateToken>({ query: IS_AUTHORIZED });

    if (client.data.validateToken) {
      return generateStaticAssets(req, res);
    }
  } catch (e) {
    return res.send(e);
  }
};
