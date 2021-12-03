import { EditorHelpers, TypeMediaInsert } from "letterpad-editor";

export const insertImageUrlInEditor = async (
  images: TypeMediaInsert[],
  helpers?: EditorHelpers,
) => {
  if (!helpers) return;
  await helpers.getPlugins().imagePlugin.insertImage(images);
};
