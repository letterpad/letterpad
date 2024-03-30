import { Editor } from "@tinymce/tinymce-react";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import "./tinymce/core";

import { subTitleEditorConfig, subTitleId } from "./tinymce/config";

interface Props {}

export const SubTitle: React.FC<Props> = memo(() => {
  const { control, watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  return (
    <Controller
      name="sub_title"
      control={control}
      render={({ field: { onChange, value, onBlur } }) => {
        return (
          <Editor
            id={subTitleId}
            value={value}
            onEditorChange={(_, editor) => {
              if (watch("id")) {
                const sub_title = editor.getContent({ format: "text" });
                onChange(sub_title.trim());
              }
            }}
            onBlur={onBlur}
            init={subTitleEditorConfig}
          />
        );
      }}
    />
  );
});
SubTitle.displayName = "SubTitle";
