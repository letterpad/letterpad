import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PostTitle, PostMeta, StyledReadMore } from "../styled/common";

import { Post } from "letterpad-src/__generated__/gqlTypes";
const StyledArticle = styled.article`
  background: rgba(var(--bg-article-item));
  border: 1px solid rgba(var(--bg-sidebar), 0.05);
  border-radius: 2px;
  padding: 1px 24px 24px;
  margin-bottom: 24px;

  .post-summary {
    margin-bottom: 16px;
  }
  a {
    color: rgba(var(--color-accent));
    &.post-link {
      color: var(--color-base);
      &:hover {
        color: rgba(var(--color-accent));
      }
    }
  }
`;

const SearchItem: React.FC<{ post: Post; href: string }> = ({ post, href }) => {
  return (
    <StyledArticle className="post-entry">
      <div className="post-details">
        <header className="post-header">
          <PostTitle medium className="post-title">
            <Link className="post-link" to={href}>
              {post.title}
            </Link>
          </PostTitle>
          <PostMeta className="post-meta">
            {moment(new Date(post.publishedAt)).format("LL")}
          </PostMeta>
        </header>
        <p className="post-summary">{post.excerpt}</p>
        <footer className="post-footer">
          <StyledReadMore className="read-more" to={href}>
            Read More →
          </StyledReadMore>
        </footer>
      </div>
    </StyledArticle>
  );
};

export default SearchItem;
