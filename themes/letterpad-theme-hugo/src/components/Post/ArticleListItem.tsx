import { PostMeta, PostTitle, StyledReadMore } from "../../styled/common";
import React, { Component } from "react";

import LazyImage from "letterpad-src/client/helpers/LazyImage";
import { Link } from "react-router-dom";
import { Post } from "letterpad-src/__generated__/gqlTypes";
import StyledArticleItem from "../../styled/StyledArticleItem";
import config from "letterpad-src/config";
import moment from "moment";
const readingTime = require("reading-time");

interface IArticleListItem {
  post: Post;
  isStatic: boolean;
}

class ArticleListItem extends Component<IArticleListItem> {
  render() {
    const post = this.props.post;
    let href = `/${post.type}/${post.slug}`;

    return (
      <StyledArticleItem className="post-entry">
        <div className="post-details">
          <header className="post-header">
            <PostTitle className="post-title">
              <Link className="post-link" to={href}>
                {post.title}
              </Link>
            </PostTitle>
            <PostMeta className="post-meta">
              {post.author.fname} {post.author.lname} ·{" "}
              {moment(post.createdAt).format("LL")}·{" "}
              {readingTime(post.html).text}
            </PostMeta>
          </header>
          <p className="post-summary">{post.excerpt}</p>
          <footer className="post-footer">
            <StyledReadMore className="read-more" to={href}>
              Read More →
            </StyledReadMore>
          </footer>
        </div>
        {post.cover_image != "" && (
          <div className="post-image-box">
            <Link className="post-link" to={href}>
              <LazyImage
                src={config.baseName + post.cover_image}
                width="100%"
              />
            </Link>
          </div>
        )}
      </StyledArticleItem>
    );
  }
}

export default ArticleListItem;
