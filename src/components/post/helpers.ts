import { EditorHelpers, TypeMediaInsert } from "letterpad-editor";

export const insertImageUrlInEditor = async (
  images: TypeMediaInsert[],
  helpers?: EditorHelpers,
) => {
  if (!helpers) return;
  images.forEach((image) => {
    helpers.getPlugins().imagePlugin.insertImage(image);
  });
};
