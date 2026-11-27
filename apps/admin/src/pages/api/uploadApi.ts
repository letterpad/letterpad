import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@/graphql/context";
import { NextApiRequestWithFormData, SessionData } from "@/graphql/types";
import { storeMediaUpload } from "@/lib/storeMediaUpload";
import logger from "@/shared/logger";

export const config = { api: { bodyParser: false } };
// Multer only needs the Node request stream for this middleware.
const parseUploads = multer().any() as unknown as (
  request: NextApiRequest,
  response: NextApiResponse,
  next: (error?: unknown) => void
) => void;

export default async function uploadApi(
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) {
  const session = (await getServerSession()) as unknown as {
    user: SessionData;
  } | null;
  if (!session?.user.id) return res.status(401).send("Unauthorized");

  await new Promise<void>((resolve, reject) => {
    parseUploads(req, res, (error) => (error ? reject(error) : resolve()));
  });

  const output = [];
  for (const file of req.files ?? []) {
    try {
      output.push(await storeMediaUpload(session.user.id, file));
    } catch (error) {
      logger.error(error);
      output.push(error);
    }
  }
  return res.json(output);
}
