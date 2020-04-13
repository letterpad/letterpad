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
        value={_slug.replace("/page/", "").replace("/post/", "")}
      />
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
`;
