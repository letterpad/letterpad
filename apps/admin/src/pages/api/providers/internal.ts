import fs from "fs";
import { imageSize } from "image-size";

import { report } from "@/components/error";

import { BlobCorrected, IMediaUploadResult } from "@/graphql/types";

export function uploadToInternal(
  file: BlobCorrected,
  uploadPath: string,
  src: string,
): Promise<IMediaUploadResult> {
  return new Promise((resolve, reject) => {
    const { buffer, originalname } = file;
    try {
      fs.writeFileSync(uploadPath, buffer);
      const size = imageSize(uploadPath);

      const resultItem: IMediaUploadResult = {
        src,
        error: null,
        name: originalname,
        size: {
          width: size.width || 0,
          height: size.height || 0,
          type: size.type || "",
        },
      };
      resolve(resultItem);
    } catch (error: any) {
      report.error(error);
      reject(error);
    }
  });
}
