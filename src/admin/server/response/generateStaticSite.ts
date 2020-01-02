import { QUERY_IS_AUTHORIZED } from "./../../../shared/queries/Queries";
import { Request, Response } from "express";
import { generateStaticAssets } from "./static-generator";
import apolloClient from "../../../shared/apolloClient";
import { clientOpts } from "..";
import { ValidateTokenQuery } from "../../../__generated__/gqlTypes";

export const generateStaticSite = async (req: Request, res: Response) => {
  try {
    const client = await apolloClient(
      true,
      clientOpts,
      req.headers.token as string,
    ).query<ValidateTokenQuery>({ query: QUERY_IS_AUTHORIZED });

    if (client.data.validateToken) {
      return generateStaticAssets(req, res);
    }
  } catch (e) {
    return res.send(e);
  }
};
