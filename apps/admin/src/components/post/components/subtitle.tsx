import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "./tinymce/core";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { debounce } from "@/shared/utils";

import { subTitleEditorConfig, subTitleId } from "./tinymce/config";

interface Props {
  postId?: number;
  sub_title: string;
}

export const SubTitle: React.FC<Props> = memo(({ postId, sub_title }) => {
  const { updateLocalState, updatePostAPI } = useUpdatePost();
  const [text] = useState(sub_title);
  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePostAPI(data), 500),
    [updatePostAPI]
  );

  return (
    <Editor
      id={subTitleId}
      initialValue={text}
      onEditorChange={(_, editor) => {
        if (postId) {
          const sub_title = editor.getContent({ format: "text" });
          debounceUpdatePostAPI({ id: postId, sub_title });
          updateLocalState({ id: postId, sub_title });
        }
      }}
      init={subTitleEditorConfig}
    />
  );
});
SubTitle.displayName = "Title";
