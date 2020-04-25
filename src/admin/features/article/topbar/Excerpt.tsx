import React, { useEffect, useState } from "react";

import PostActions from "../PostActions";
import { TextArea } from "../../../components/textarea";
import { mdToHtml } from "letterpad-editor";
import styled from "styled-components";
import utils from "../../../../shared/util";

interface IProps {
  excerpt: string;
  md: string;
  updatePost: () => void;
  isSettingsOpen: boolean;
}
const Excerpt: React.FC<IProps> = ({
  excerpt,
  md,
  updatePost,
  isSettingsOpen,
}) => {
  const [description, setDescription] = useState<string>(excerpt);
  const maxLength = 160;

  useEffect(() => {
    const oldExcerpt = excerpt;
    if (!excerpt) {
      // the body will contain html characters. Remove all the tags and get plain text
      const tmp = document.createElement("DIV");
      if (md === "") md = PostActions.getData().md;
      tmp.innerHTML = mdToHtml(md);
      excerpt = tmp.textContent || tmp.innerText || "";
      if (excerpt.length > maxLength) {
        excerpt = trimString(excerpt, maxLength);
      }
    } else if (excerpt.length > maxLength) {
      excerpt = trimString(excerpt, maxLength);
    }
    if (oldExcerpt !== excerpt) {
      const formattedExcerpt = excerpt.replace(/\n/, "");
      setDescription(formattedExcerpt);
      PostActions.setDraft({
        excerpt: formattedExcerpt,
      });
    }
  }, [isSettingsOpen]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const excerpt = e.target.value;
    setDescription(excerpt);
    PostActions.setDraft({
      excerpt,
    });
    utils.debounce(updatePost, 800)();
  };

  return (
    <Container>
      <label>Blog Post Description</label>
      <TextArea
        data-testid="excerpt"
        autoAdjustHeight={true}
        maxLength={maxLength}
        onChange={onChange}
        placeholder="Write a small description"
        defaultValue={description}
      ></TextArea>
      <span className="counter">{description.length} / 160</span>
    </Container>
  );
};

function trimString(str: string, maxLength) {
  //trim the string to the maximum length
  let trimmedString = str.substr(0, maxLength);
  //re-trim if we are in the middle of a word
  return (
    trimmedString.substr(
      0,
      Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")),
    ) + "..."
  );
}

export default Excerpt;

const Container = styled.div`
  position: relative;
  textarea {
    border: 1px solid var(--color-border);
    padding: 16px;
    width: 100%;
    font-weight: 400;
    background: transparent;
    color: var(--color-base);
    line-height: 1.6;
  }
  .counter {
    position: absolute;
    bottom: 8px;
    left: 80%;
    font-size: 0.7rem;
    opacity: 0.6;
  }
`;
