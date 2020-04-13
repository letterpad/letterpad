import {
  Post,
  PostTypes,
  TaxonomyType,
} from "../../../../__generated__/gqlTypes";
import React, { useEffect, useState } from "react";

import { Button } from "../../../components/button";
import CloseIcon from "../../../public/images/Close";
import Excerpt from "./Excerpt";
import FeaturedImage from "./FeaturedImage";
import FeaturedPost from "./FeaturedPost";
import { Link } from "react-router-dom";
import { MediaProvider } from "../Edit";
import PostActions from "../PostActions";
import PublishOptions from "./PublishOptions";
import Taxonomies from "./Taxonomies";
import UpdateSlug from "./UpdateSlug";
import styled from "styled-components";

interface IProps {
  onDelete: (e: React.SyntheticEvent) => void;
  isOpen: boolean;
  toggleDisplay: (flag: boolean) => void;
}

const PostSettings: React.FC<IProps> = ({
  onDelete,
  isOpen,
  toggleDisplay,
}) => {
  const [post, setPost] = useState<Post>(PostActions.getData());

  useEffect(() => {
    setPost(PostActions.getData());
  }, [isOpen]);

  if (!post) return null;

  const updatePost = async () => {
    await PostActions.updatePost();
    setPost(PostActions.getData());
  };

  const closeDrawer = (e: React.SyntheticEvent) => {
    e.preventDefault();
    toggleDisplay(false);
  };
  return (
    <div>
      <Container isOpen={isOpen}>
        <Link to="#" onClick={closeDrawer}>
          <CloseIcon />
        </Link>
        <br />
        <br />
        <PublishOptions status={post.status} updatePost={updatePost} />
        <FeaturedPost isFeatured={post.featured} updatePost={updatePost} />
        <Excerpt
          html={post.html}
          excerpt={post.excerpt}
          updatePost={updatePost}
        />
        <UpdateSlug slug={post.slug} updatePost={updatePost} />
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={() => null}
            post={post}
            for={TaxonomyType.PostTag}
            suggestions={[]}
          />
        )}
        <FeaturedImage post={post} mediaProvider={MediaProvider.Unsplash} />
        <br />
        <Button btnSize="md" onClick={onDelete}>
          Delete
        </Button>
        <br />
        <br />
      </Container>
      {isOpen && <BackFade onClick={closeDrawer} />}
    </div>
  );
};

export default PostSettings;

interface IContainerProps {
  isOpen: boolean;
}
const Container = styled.div<IContainerProps>`
  position: fixed;
  left: 100%;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(-290px)" : "translateX(0px)"};
  transition: 0.4s cubic-bezier(0.075, 0.82, 0.165, 1) all;
  top: 0px;
  width: 290px;
  height: 100vh;
  overflow-y: auto;
  background: var(--bg-base);
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  padding: 24px;
  > div {
    label {
      font-size: 0.8rem;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
      margin-top: 28px;
    }
    &:first-child label {
      margin-top: 0px;
    }
  }
  button {
    text-transform: uppercase;
    font-size: 0.8rem;
  }
`;

const BackFade = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: #333;
  opacity: 0.8;
`;
