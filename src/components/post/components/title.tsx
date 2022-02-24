import { memo } from "react";
import { Input } from "antd";
import { usePostContext } from "../context";

interface Props {
  onEnter(): void;
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
const Title: React.FC<Props> = ({ onEnter }) => {
  const { setPostAttribute, post } = usePostContext();
  return (
    <>
      <Input.TextArea
        {...defaults}
        value={post?.title}
        onChange={(e) => {
          setPostAttribute && setPostAttribute({ title: e.target.value });
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        className="title"
      />
      <style jsx global>{`
        textarea.title {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default memo(Title);
