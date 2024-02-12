import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef } from "react";
import "./tinymce/core";

import { titleEditorConfig, titleId } from "./tinymce/config";

interface Props {
  postId?: number;
  title: string;
  onTitleChange: (title: string) => void;
}

export const Title: React.FC<Props> = memo(
  ({ postId, title, onTitleChange }) => {
    const ref = useRef<Editor>(null);

    useEffect(() => {
      if (ref.current && title.length === 0) {
        try {
          ref.current.editor?.focus();
        } catch (e) {
          //
        }
      }
    }, [title]);

    return (
      <Editor
        ref={ref}
        id={titleId}
        initialValue={title ?? null}
        onBlur={() => {
          if (postId) {
            const newtitle = ref.current?.editor?.getContent({
              format: "text",
            });
            if (title !== newtitle) onTitleChange(newtitle ?? "");
          }
        }}
        // onEditorChange={(_, editor) => {
        //   if (postId) {
        //     const newtitle = editor.getContent({ format: "text" });
        //     if (title !== newtitle) onTitleChange(newtitle);
        //   }
        // }}
        init={titleEditorConfig}
      />
    );
  }
);
Title.displayName = "Title";
