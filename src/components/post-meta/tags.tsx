import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { PostQuery } from "../../../__generated__/src/graphql/queries/queries.graphql";
import { InputUpdatePost } from "../../../__generated__/src/graphql/type-defs.graphqls";

type ValueOf<T> = T[keyof T];

interface IProps {
  post: PostQuery["post"];
  setPostAttribute: (
    key: keyof InputUpdatePost,
    value: ValueOf<InputUpdatePost>,
  ) => void;
}

const Tags = ({ post, setPostAttribute }: IProps) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (post.__typename !== "Post") return null;

  const handleInputConfirm = () => {
    setInputVisible(false);
    if (inputValue && post.tags) {
      setPostAttribute("tags", [
        ...post.tags,
        { id: 0, name: inputValue, slug: inputValue, desc: "" },
      ]);
      setInputValue("");
    }
  };

  return (
    <Wrapper>
      <label>Tags</label>
      {post.tags?.map(tag => (
        <Tag
          key={tag.name}
          closable
          onClose={() => {
            const tags = post.tags?.filter(ele => ele.name !== tag.name);
            setPostAttribute("tags", tags);
          }}
        >
          {tag.name}
        </Tag>
      ))}
      {inputVisible && (
        <Input
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          className="site-tag-plus"
          onClick={() => {
            setInputVisible(true);
          }}
        >
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </Wrapper>
  );
};

export default Tags;

const Wrapper = styled.div`
  .site-tag-plus {
    background: #fff;
    border-style: dashed;
  }
  .edit-tag {
    user-select: none;
  }
  .tag-input {
    width: 78px;
    margin-right: 8px;
    vertical-align: top;
  }
`;
