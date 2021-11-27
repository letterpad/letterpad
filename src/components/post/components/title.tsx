import { memo } from "react";
import { Input } from "antd";
import { usePostContext } from "../context";

interface Props {
  onEnter(): void;
}

const defaults = {
  style: {
    padding: 0,
    fontSize: 38,
    lineHeight: 1,
    marginBottom: 80,
    textAlign: "center" as any,
  },
  rows: 2,
  autoSize: true,
  placeholder: "Enter a title",
  bordered: false,
};
const Title: React.FC<Props> = ({ onEnter }) => {
  const { setPostAttribute, post } = usePostContext();
  return (
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
    />
  );
};

export default memo(Title);
