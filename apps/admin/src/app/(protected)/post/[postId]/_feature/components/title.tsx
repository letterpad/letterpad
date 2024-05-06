import { Editor } from "@tinymce/tinymce-react";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { memo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Editor as TinyMCEEditor } from "tinymce";
import "./tinymce/core";

import { titleEditorConfig, titleId } from "./tinymce/config";

interface Props {}

export const Title: React.FC<Props> = memo(({}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { control, watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  const title = watch("title");

  return (
    <Controller
      name="title"
      control={control}
      rules={{ required: "Title is required" }}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <Editor
            onInit={(_, editor) =>
              (editorRef.current = editor as unknown as TinyMCEEditor)
            }
            id={titleId}
            initialValue={title}
            onBlur={() => {
              if (watch("id")) {
                const newtitle = editorRef.current?.getContent({
                  format: "text",
                });
                if (title !== newtitle) onChange(newtitle ?? "");
              }
              onBlur();
            }}
            init={titleEditorConfig}
            licenseKey="gpl"
          />
        );
      }}
    ></Controller>
  );
});
Title.displayName = "Title";
