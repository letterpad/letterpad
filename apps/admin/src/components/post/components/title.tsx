import { useEffect, useRef } from "react";
import { TextArea } from "ui";

import { useUpdatePost } from "@/hooks/useUpdatePost";

interface Props {
  onEnter(): void;
  postId?: number;
  title: string;
}
enum TextAlign {
  center = "center",
}
const defaults = {
  style: {
    padding: 0,
    fontSize: 38,
    lineHeight: 1,
    minHeight: 50,
    textAlign: TextAlign.center,
    // overflow: "hidden",
    fontWeight: "bold",
    border: "none",
    background: "transparent",
  },
  rows: 1,
  placeholder: "Enter a title",
  maxLength: 140,
};
export const Title: React.FC<Props> = ({ onEnter, postId, title }) => {
  const { updatePost, updateLocalState } = useUpdatePost();
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current && title.length === 0) {
      ref.current.focus();
    }
  }, [title]);

  return (
    <>
      <TextArea
        {...defaults}
        value={title}
        onChange={(e) => {
          if (postId) updateLocalState({ title: e.target.value, id: postId });
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        onBlur={(e) =>
          postId && updatePost({ title: e.target.value.trim(), id: postId })
        }
        placeholder="Enter a title"
        className="title resize-none"
        data-testid="postTitleInput"
        autoGrow={true}
        ref={ref}
      />
      <style jsx global>{`
        textarea.title {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};
