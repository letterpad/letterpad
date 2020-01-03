import React from "react";
import styled from "styled-components";

const Input = styled.input`
  border: transparent;
  background: transparent;
  color: var(--color-base);
  font-size: 40px;
`;

interface IPostTitleProps {
  text: string;
  onChange: (title: string) => void;
  placeholder: string;
}

const PostTitle: React.FC<IPostTitleProps> = ({
  text,
  onChange,
  placeholder,
}) => {
  const [title, setTitle] = React.useState(text);

  const onTitleChange = (title: string) => {
    setTitle(title);
    if (typeof onChange === "function") {
      onChange(title);
    }
  };

  return (
    <Input
      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
        onTitleChange(e.target.value)
      }
      contentEditable={true}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onTitleChange(e.target.value)
      }
      value={title}
      placeholder={placeholder}
    />
  );
};

export default PostTitle;
