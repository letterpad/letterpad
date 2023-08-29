import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "./tinymce/core";

import { debounce } from "@/shared/utils";

import { titleEditorConfig, titleId } from "./tinymce/config";
import { useUpdatePost } from "../api.client";

interface Props {
  postId?: number;
  title: string;
}

export const Title: React.FC<Props> = memo(({ postId, title }) => {
  const { updatePost } = useUpdatePost();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text] = useState(title);
  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePost(data), 500),
    [updatePost]
  );

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
        if (postId) {
          const title = editor.getContent({ format: "text" });
          debounceUpdatePostAPI({ id: postId, title });
        }
      }}
      init={titleEditorConfig}
    />
  );
});
Title.displayName = "Title";
