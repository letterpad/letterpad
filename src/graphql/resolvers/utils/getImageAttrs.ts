import logger from "@/shared/logger";

import { getImageDimensions } from "../helpers";

export async function getCoverImageAttrs(cover_image): Promise<{
  cover_image: string;
  cover_image_width: number;
  cover_image_height: number;
}> {
  if (!cover_image)
    return { cover_image: "", cover_image_width: 0, cover_image_height: 0 };
  const { width, height } = cover_image;
  const src = cover_image.src?.replace(process.env.ROOT_URL || "", "");

  const data = {
    cover_image: src,
    cover_image_width: width,
    cover_image_height: height,
  };
  if (width && height && src) {
    return data;
  }
  if (!src) return data;

  try {
    const imageSize = await getImageDimensions(src);
    data.cover_image_width = imageSize.width;
    data.cover_image_height = imageSize.height;
  } catch (e) {
    logger.error(`Failed to retrieve width and height of image - ${src}`);
  }

  return data;
}
