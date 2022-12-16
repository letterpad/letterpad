import { useUpdatePost } from "@/hooks/useUpdatePost";

import { TextArea } from "@/components_v2/textarea";

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
  maxRows: 3,
  autoSize: true,
  placeholder: "Enter a title",
  bordered: false,
  maxLength: 140,
};
export const Title: React.FC<Props> = ({ onEnter, postId, title }) => {
  const { updatePost, updateLocalState } = useUpdatePost();

  return (
    <>
      <TextArea
        {...defaults}
        value={title}
        onChange={(e) => {
          if (postId)
            updateLocalState({ title: e.target.value.trim(), id: postId });
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
      />
      <style jsx global>{`
        textarea.title {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};
