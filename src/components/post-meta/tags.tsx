import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { PostQuery } from "@/__generated__/queries/queries.graphql";
import { InputUpdatePost } from "@/__generated__/type-defs.graphqls";

interface IProps {
  post: PostQuery["post"];
  setPostAttribute: (attrs: Omit<InputUpdatePost, "id">) => void;
}

const Tags = ({ post, setPostAttribute }: IProps) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (post.__typename !== "Post") return null;

  const handleInputConfirm = () => {
    setInputVisible(false);
    if (inputValue && post.tags) {
      const tags = post.tags.map(tag => {
        const { id, slug, name, desc } = tag;
        return { id, slug, name, desc: desc || "" };
      });
      setPostAttribute({
        tags: [
          ...tags,
          { id: 0, name: inputValue, slug: inputValue, desc: "" },
        ],
      });
      setInputValue("");
    }
  };

  const tagInputRef = ref => {
    if (ref) {
      ref.input.focus();
    }
  };

  return (
    <Wrapper>
      <label>Tags</label>
      <br />
      {post.tags?.map(tag => (
        <Tag
          key={tag.name}
          closable
          onClose={() => {
            if (!post.tags) return;
            const tags = post.tags
              .filter(ele => ele.name !== tag.name)
              .map(tag => {
                const { id, slug, name, desc } = tag;
                return { id, slug, name, desc: desc || "" };
              });
            setPostAttribute({ tags });
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
          ref={tagInputRef}
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
