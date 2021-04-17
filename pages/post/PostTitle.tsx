// import PostActions from "./PostActions";
import React from "react";
import styled from "styled-components";

const Input = styled.div`
  border: transparent;
  background: transparent;
  color: var(--color-base);
  font-size: 40px;
  width: 100%;
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
      onBlur={async (e: React.FocusEvent<HTMLInputElement>) => {
        onTitleChange(e.target.innerText);
      }}
      contentEditable={true}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onTitleChange(e.target.innerText)
      }
      placeholder={placeholder}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      }}
      suppressContentEditableWarning={true}
    >
      {title}
    </Input>
  );
};

export default PostTitle;
