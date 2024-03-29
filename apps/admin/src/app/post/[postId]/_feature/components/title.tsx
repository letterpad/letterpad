import { Editor } from "@tinymce/tinymce-react";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import "./tinymce/core";

import { titleEditorConfig, titleId } from "./tinymce/config";

interface Props {}

export const Title: React.FC<Props> = memo(({}) => {
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
            id={titleId}
            value={title}
            onEditorChange={(_, editor) => {
              if (watch("id")) {
                const newtitle = editor?.getContent({
                  format: "text",
                });
                if (title !== newtitle) onChange(newtitle ?? "");
              }
            }}
            onBlur={onBlur}
            init={titleEditorConfig}
          />
        );
      }}
    ></Controller>
  );
});
Title.displayName = "Title";
