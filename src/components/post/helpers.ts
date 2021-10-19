import { Helpers, TypeMediaInsert } from "letterpad-editor";

export const insertImageUrlInEditor = async (
  images: TypeMediaInsert[],
  helpers?: Helpers,
) => {
  const urls = Object.keys(images);
  if (!helpers) return;
  urls.forEach((src) => {
    return helpers.pluginHelpers.imagePlugin.insertImage({
      src,
      caption: images[src].caption || "",
      width: "100%",
    });
  });
};
