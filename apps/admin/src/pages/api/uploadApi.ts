import crypto from "crypto";
import multer from "multer";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import path from "path";

import { prisma } from "@/lib/prisma";

import { basePath } from "@/constants";
import {
  BlobCorrected,
  IMediaUploadResult,
  NextApiRequestWithFormData,
  SessionData,
} from "@/graphql/types";

import logger from "./../../shared/logger";
import initMiddleware from "./middleware";
import { uploadToCloudinary } from "./providers/cloudinary";
import { uploadToInternal } from "./providers/internal";

const upload = multer();
const uploadDir = path.join(process.cwd(), "public/uploads/");
// for parsing multipart/form-data
// note that Multer limits to 1MB file size by default
const multerAny = initMiddleware(upload.any());

// Doc on custom API configuration:
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadApi = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  await multerAny(req, res);
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session || !session.user.id) return res.status(401).send("Unauthorized");

  // This operation expects a single file upload.
  if (!req.files?.length || req.files.length > 1) {
    res.statusCode = 400;
    res.status(501).end("The request can contain only 1 file");
    return;
  }

  let files: BlobCorrected[] = req.files;
  if (!Array.isArray(files)) {
    files = [files];
  }

  const { cloudinary_key, cloudinary_name, cloudinary_secret } =
    await getCloudinaryCreds(session.user.id);

  logger.debug(`Received ${files.length} file/s to upload`);

  const output: IMediaUploadResult[] = [];

  for (const file of files) {
    if (file) {
      const hashSum = crypto.createHash("sha256");
      hashSum.update(file.buffer);

      const hex = hashSum.digest("hex");
      const extension = file.originalname.substr(
        file.originalname.lastIndexOf(".") + 1,
      );
      file.hash = hex;
      const filename = hex + "." + extension;
      const uploadPath = uploadDir + filename;
      try {
        let result: IMediaUploadResult;
        if (cloudinary_key && cloudinary_name && cloudinary_secret) {
          result = await uploadToCloudinary(file, uploadPath, {
            api_key: cloudinary_key,
            cloud_name: cloudinary_name,
            api_secret: cloudinary_secret,
          });
        } else {
          result = await uploadToInternal(
            file,
            uploadPath,
            basePath + "/uploads/" + filename,
          );
        }
        await upsertMedia(result, session.user.id);
        output.push(result);
      } catch (e: any) {
        logger.error(e);
        output.push(e);
      }
    }
  }

  res.json(output);
};

export async function upsertMedia(result: IMediaUploadResult, id: number) {
  let media = await prisma.upload.findFirst({
    where: {
      url: result.src,
    },
  });
  const author = await prisma.author.findFirst({ where: { id } });
  if (!author) {
    return;
  }
  if (!media) {
    /*@TODO - Convert this to a graphql query */
    media = await prisma.upload.create({
      data: {
        url: result.src,
        name: result.name,
        description: "",
        height: result.size.height,
        width: result.size.width,
        createdAt: new Date(),
        author: {
          connect: {
            id: author.id,
          },
        },
      },
    });
  }
}

async function getCloudinaryCreds(author_id: number) {
  // if the creds has been set globally with env variables, then return that.
  if (
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_SECRET
  ) {
    return {
      cloudinary_key: process.env.CLOUDINARY_KEY,
      cloudinary_name: process.env.CLOUDINARY_NAME,
      cloudinary_secret: process.env.CLOUDINARY_SECRET,
    };
  }

  const setting = await prisma.setting.findFirst({
    where: {
      author: {
        id: author_id,
      },
    },
  });

  if (setting) {
    const { cloudinary_key, cloudinary_name, cloudinary_secret } = setting;
    return { cloudinary_key, cloudinary_name, cloudinary_secret };
  }
  return {};
}

export default uploadApi;
