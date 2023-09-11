import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "./tinymce/core";

import { titleEditorConfig, titleId } from "./tinymce/config";
import { useActivateEditorChangeAfterClick } from "../hooks";

interface Props {
  postId?: number;
  title: string;
  onTitleChange: (title: string) => void;
}

export const Title: React.FC<Props> = memo(
  ({ postId, title, onTitleChange }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [text] = useState(title);
    const allowEditorChange = useActivateEditorChangeAfterClick();

    useEffect(() => {
      if (ref.current && title.length === 0) {
        ref.current.focus();
      }
    }, [title]);

    return (
      <Editor
        id={titleId}
        initialValue={text}
        onEditorChange={(_, editor) => {
          if (postId && allowEditorChange) {
            const title = editor.getContent({ format: "text" });
            onTitleChange(title);
          }
        }}
        init={titleEditorConfig}
      />
    );
  }
);
Title.displayName = "Title";
