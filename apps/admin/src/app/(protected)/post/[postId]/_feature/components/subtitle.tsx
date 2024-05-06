import { Editor } from "@tinymce/tinymce-react";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { memo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Editor as TinyMCEEditor } from "tinymce";
import "./tinymce/core";

import { subTitleEditorConfig, subTitleId } from "./tinymce/config";

interface Props {}

export const SubTitle: React.FC<Props> = memo(() => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { control, watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  const sub_title = watch("sub_title");
  return (
    <Controller
      name="sub_title"
      control={control}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <Editor
            onInit={(_, editor) =>
              (editorRef.current = editor as unknown as TinyMCEEditor)
            }
            id={subTitleId}
            initialValue={sub_title}
            onBlur={() => {
              if (watch("id")) {
                const newtitle = editorRef.current?.getContent({
                  format: "text",
                });
                if (sub_title !== newtitle) onChange(newtitle ?? "");
              }
              onBlur();
            }}
            init={subTitleEditorConfig}
          />
        );
      }}
    />
  );
});
SubTitle.displayName = "SubTitle";
