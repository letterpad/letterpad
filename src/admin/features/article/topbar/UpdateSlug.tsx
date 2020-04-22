import React, { useEffect, useState } from "react";

import PostActions from "../PostActions";
import styled from "styled-components";
import utils from "../../../../shared/util";

interface IProps {
  slug: string;
  updatePost: () => void;
}
const UpdateSlug: React.FC<IProps> = ({ slug, updatePost }) => {
  const [_slug, setSlug] = useState(slug);

  useEffect(() => {
    setSlug(slug);
  }, [slug]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.trim());
    if (e.target.value.trim() === "") return;
    PostActions.setDraft({
      slug: e.target.value.trim(),
    });
    utils.debounce(updatePost, 100)();
  };

  return (
    <Container>
      <label>Path (displayed in url)</label>
      <input
        onChange={onChange}
        placeholder="Path that will be displayed in url"
        value={_slug.split("/").pop()}
      />
      <br />
      <span>
        <strong>Preview:</strong>&nbsp;
        <a href={_slug} target="_blank">
          {_slug}
        </a>
      </span>
    </Container>
  );
};

export default UpdateSlug;

const Container = styled.div`
  input {
    border: 1px solid var(--color-border);
    padding: 16px;
    width: 100%;
    font-weight: 400;
    background: transparent;
    color: var(--color-base);
  }

  span {
    font-size: 0.6rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;
