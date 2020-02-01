import { QUERY_IS_AUTHORIZED } from "../../../shared/queries/Queries";
import { Request, Response } from "express";
import apolloClient from "../../../shared/apolloClient";
import { clientOpts } from "..";
import { ValidateTokenQuery } from "../../../__generated__/gqlTypes";

export const createPR = async (req: Request, res: Response) => {
  try {
    const client = await apolloClient(
      true,
      clientOpts,
      req.headers.token as string,
    ).query<ValidateTokenQuery>({ query: QUERY_IS_AUTHORIZED });

    if (client.data.validateToken) {
      return createPullRequest(res);
    }
  } catch (e) {
    return res.send(e);
  }
};

const types = {
  text: "text",
  progress: "progress",
};

const createPullRequest = (res: Response) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  const exec = require("child_process").exec;
  const testscript = exec("sh ../../../admin/static-generator/createPr.sh");

  testscript.stdout.on("data", chunk => {
    const data = chunk.toString("utf8");
    res.write(JSON.stringify({ type: types.text, message: data }));
  });

  testscript.stderr.on("data", function(err) {
    res.end(JSON.stringify({ type: types.text, message: err.message }));
  });

  testscript.on("close", function() {
    res.end(JSON.stringify({ type: types.text, message: "done" }));
  });
};
