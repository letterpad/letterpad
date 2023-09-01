import { Editor } from "@tinymce/tinymce-react";
import { memo, useMemo, useState } from "react";
import "./tinymce/core";

import { debounce } from "@/shared/utils";

import { subTitleEditorConfig, subTitleId } from "./tinymce/config";
import { useUpdatePost } from "../api.client";

interface Props {
  postId?: number;
  sub_title: string;
}

export const SubTitle: React.FC<Props> = memo(({ postId, sub_title }) => {
  const { updatePost } = useUpdatePost();
  const [text] = useState(sub_title);

  const debounceUpdatePostAPI = useMemo(
    () => debounce((data) => updatePost(data), 500),
    [updatePost]
  );

  return (
    <Editor
      id={subTitleId}
      initialValue={text}
      onEditorChange={(_, editor) => {
        if (postId) {
          const sub_title = editor.getContent({ format: "text" });
          debounceUpdatePostAPI({ id: postId, sub_title });
        }
      }}
      init={subTitleEditorConfig}
    />
  );
});
SubTitle.displayName = "Title";
