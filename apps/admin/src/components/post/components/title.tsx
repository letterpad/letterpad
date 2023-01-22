import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "./tinymce/core";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { debounce } from "@/shared/utils";

import { titleEditorConfig, titleId } from "./tinymce/config";

interface Props {
  postId?: number;
  title: string;
}

export const Title: React.FC<Props> = memo(({ postId, title }) => {
  const { updateLocalState, updatePostAPI } = useUpdatePost();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text] = useState(title);
  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePostAPI(data), 500),
    [updatePostAPI]
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
          updateLocalState({ id: postId, title: title });
        }
      }}
      init={titleEditorConfig}
    />
  );
});
Title.displayName = "Title";
