import { Editor } from "@tinymce/tinymce-react";
import { memo, useState } from "react";
import "./tinymce/core";

import { subTitleEditorConfig, subTitleId } from "./tinymce/config";
import { useActivateEditorChangeAfterClick } from "../hooks";

interface Props {
  postId?: string;
  sub_title: string;
  onSubtitleChange: (sub_title: string) => void;
}

export const SubTitle: React.FC<Props> = memo(
  ({ postId, sub_title, onSubtitleChange }) => {
    const [text] = useState(sub_title);
    const allowEditorChange = useActivateEditorChangeAfterClick();
    return (
      <Editor
        id={subTitleId}
        initialValue={text}
        onEditorChange={(_, editor) => {
          if (postId && allowEditorChange) {
            const sub_title = editor.getContent({ format: "text" });
            onSubtitleChange(sub_title);
          }
        }}
        init={subTitleEditorConfig}
      />
    );
  }
);
SubTitle.displayName = "Title";
