import { Input } from "antd";
import { usePostContext } from "../context";

interface Props {
  title: string;
  onEnter(): void;
}

const defaults = {
  style: {
    padding: 0,
    fontSize: 38,
    lineHeight: 1,
    marginBottom: 40,
  },
  rows: 2,
  autoSize: true,
  placeholder: "Enter a title",
  bordered: false,
};
const Title: React.FC<Props> = ({ title, onEnter }) => {
  const { setPostAttribute } = usePostContext();
  return (
    <Input.TextArea
      {...defaults}
      value={title}
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

export default Title;
