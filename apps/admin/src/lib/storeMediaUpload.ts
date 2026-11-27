import { createHash } from "node:crypto";
import path from "node:path";

import { basePath } from "@/constants";
import { MediaUploadFile } from "@/graphql/types";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/pages/api/providers/cloudinary";
import { uploadToInternal } from "@/pages/api/providers/internal";

export async function storeMediaUpload(
  authorId: string,
  file: MediaUploadFile
) {
  const settings = await prisma.setting.findUnique({
    where: { author_id: authorId },
    select: {
      cloudinary_key: true,
      cloudinary_name: true,
      cloudinary_secret: true,
    },
  });
  const global = {
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
  };
  const creds =
    global.api_key && global.api_secret && global.cloud_name
      ? global
      : {
          api_key: settings?.cloudinary_key,
          api_secret: settings?.cloudinary_secret,
          cloud_name: settings?.cloudinary_name,
        };

  const hash = createHash("sha256").update(file.buffer).digest("hex");
  const extension = path.extname(file.originalname).toLowerCase();
  const filename = hash + extension;
  const result =
    creds.api_key && creds.api_secret && creds.cloud_name
      ? await uploadToCloudinary(file, {
          api_key: creds.api_key,
          api_secret: creds.api_secret,
          cloud_name: creds.cloud_name,
        })
      : await uploadToInternal(
          file,
          path.join(process.cwd(), "public", "uploads", filename),
          basePath + "/uploads/" + filename
        );

  const existing = await prisma.upload.findFirst({
    where: { url: result.src, author_id: authorId },
    select: { id: true },
  });
  if (!existing) {
    await prisma.upload.create({
      data: {
        author_id: authorId,
        url: result.src,
        name: result.name,
        width: result.size.width,
        height: result.size.height,
      },
    });
  }
  return result;
}
