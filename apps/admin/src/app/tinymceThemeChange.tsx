"use client";
import { useTheme } from "ui/dist/index.mjs";
export const TinyMceStyleChange = () => {
  const { theme } = useTheme();

  const tinymceTheme = theme === "dark" ? "oxide-dark" : "oxide";

  return (
    <>
      <link
        rel="stylesheet"
        className="tinymce-theme"
        href={`https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.0.1/skins/ui/${tinymceTheme}/skin.min.css`}
      />
      <link
        rel="stylesheet"
        className="tinymce-theme"
        href={`https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.0.1/skins/ui/${tinymceTheme}/content.min.css`}
      />
    </>
  );
};
