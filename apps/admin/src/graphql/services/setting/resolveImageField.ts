import { Image, ResolversParentTypes } from "@/__generated__/__types__";
import { basePath } from "@/constants";
import { getRootUrl } from "@/shared/getRootUrl";

export const resolveImageField = async (
  image: Image | undefined
): Promise<ResolversParentTypes["Image"]> => {
  image = parse(image ?? "");
  if (image?.src && !image.src.startsWith("http")) {
    image.src = getRootUrl() + image.src.replace(basePath, "");
  }
  if (!image) return {};
  return image;
};

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
