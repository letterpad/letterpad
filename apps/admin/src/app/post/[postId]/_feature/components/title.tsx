import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "./tinymce/core";

import { titleEditorConfig, titleId } from "./tinymce/config";

interface Props {
  postId?: number;
  title: string;
  onTitleChange: (title: string) => void;
}

export const Title: React.FC<Props> = memo(
  ({ postId, title, onTitleChange }) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (ref.current && title.length === 0) {
        ref.current.focus();
      }
    }, [title]);

    return (
      <Editor
        id={titleId}
        initialValue={title ?? null}
        onEditorChange={(_, editor) => {
          if (postId) {
            const newtitle = editor.getContent({ format: "text" });
            if (title !== newtitle) onTitleChange(newtitle);
          }
        }}
        init={titleEditorConfig}
      />
    );
  }
);
Title.displayName = "Title";
