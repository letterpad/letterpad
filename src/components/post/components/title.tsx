import { Input } from "antd";
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
    overflow: "hidden",
    fontWeight: "bold",
  },
  rows: 3,
  autoSize: true,
  placeholder: "Enter a title",
  bordered: false,
};
const Title: React.FC<Props> = ({ onEnter, postId, title }) => {
  const { updatePost, updateLocalState } = useUpdatePost();

  return (
    <>
      <Input.TextArea
        {...defaults}
        defaultValue={title}
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
          postId && updatePost({ title: e.target.value, id: postId })
        }
        className="title"
        data-testid="postTitleInput"
      />
      <style jsx global>{`
        textarea.title {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Title;
