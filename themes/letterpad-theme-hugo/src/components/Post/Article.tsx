import { PostMeta, PostTitle, StyledTags } from "../../styled/common";
import React, { Component } from "react";

import Disqus from "disqus-react";
import HeroImage from "../HeroImage";
import { Link } from "react-router-dom";
import { Post } from "letterpad-src/__generated__/gqlTypes";
import StyledAuthor from "../../styled/StyledAuthor";
import { TypeSettings } from "letterpad-src/client/types";
import config from "letterpad-src/config";
import moment from "moment";
import styled from "styled-components";

interface IArticle {
  post: Post;
  settings: TypeSettings;
  adjacentPosts?: any;
}
export default class Article extends Component<IArticle> {
  render() {
    const tags: JSX.Element[] = [];
    const categories: JSX.Element[] = [];
    const { post } = this.props;
    const disqusShortname = this.props.settings.disqus_id.value;
    const disqusConfig = {
      url: post.slug,
      identifier: post.id.toString(),
      title: post.title,
    };

    post.taxonomies.forEach((taxonomy, i) => {
      if (!taxonomy) return;
      if (taxonomy.type === "post_category") {
        categories.push(
          <Link key={i} to={"/category/" + taxonomy.slug}>
            {taxonomy.name}
          </Link>,
        );
      } else {
        tags.push(
          <Link key={i} to={"/tag/" + taxonomy.slug}>
            #{taxonomy.name}
          </Link>,
        );
      }
    });

    const content = post.html;
    const displayAuthor = JSON.parse(
      this.props.settings.displayAuthorInfo.value,
    ); // convert "true" to true

    return (
      <section className="post-detail">
        <HeroImage
          image={config.baseName + post.cover_image}
          display={post.cover_image.length > 0}
        />
        <ArticleHolder>
          <header className="post-header">
            <PostTitle large className="post-title">
              {post.title}
            </PostTitle>
            <PostMeta className="post-meta">
              {this.props.post.author.fname} ·{" "}
              {moment(post.createdAt).format("LL")} · 4 min read ·{" "}
              <StyledTags className="tags">{categories}</StyledTags>
            </PostMeta>
          </header>
          <StyledArticle className="post-content">
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </StyledArticle>
          {tags.length > 0 && <StyledTags className="tags">{tags}</StyledTags>}
          {displayAuthor && post.type == "post" && (
            <StyledAuthor className="author-info">
              <div className="author-avatar">
                <img src={config.baseName + post.author.avatar} />
              </div>
              <div className="author-details">
                <div className="author-name">
                  {post.author.fname} {post.author.lname}
                </div>
                <div className="author-bio">{post.author.bio}</div>
              </div>
            </StyledAuthor>
          )}
          {/* {this.props.adjacsentPosts} */}

          {disqusShortname && post.type == "post" && (
            <div id="disqus_thread_parent">
              <Disqus.DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
              />
            </div>
          )}
        </ArticleHolder>
      </section>
    );
  }
}

const StyledArticle = styled.article`
  --editorPadding: 1rem;
  --spacingTop: 2rem;
  --spacingTopSmall: 0.5rem;
  --spacingBottom: 1rem;

  position: relative;
  line-height: 1.8;
  word-wrap: break-word;
  word-break: break-word;
  flex: 1;
  hyphens: auto;
  img {
    display: block;
    width: 100%;
    margin: 2rem auto;
    object-fit: cover;
    max-width: 100%;
    box-shadow: 0px 0px 18px 8px rgba(0, 0, 0, 0.12);

    @media screen and (max-width: 800px) {
      box-shadow: none;
    }
  }

  blockquote {
    border-left: 5px solid rgba(var(--color-accent), 1);
  }

  .lp-editor div[data-slate-editor="true"] {
    padding-bottom: 400px;
  }
  .lp-editor p {
    margin: 1.2rem 0px;
  }
  .lp-editor h1,
  .lp-editor h2,
  .lp-editor h3,
  .lp-editor h4,
  .lp-editor h5,
  .lp-editor h6 {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    text-rendering: optimizeLegibility;
    line-height: 1;
    padding-top: var(--spacingTop);
    padding-bottom: var(--spacingBottom);
  }

  .lp-editor h1 {
    font-size: 2rem;
    border-bottom: solid 1px var(--color-border);
  }

  .lp-editor h2 {
    font-size: 1.6rem;
  }

  .lp-editor h3 {
    font-size: 1.4rem;
  }

  .lp-editor h4 {
    font-size: 1.2rem;
  }

  .lp-editor h5 {
    font-size: 1.1rem;
  }

  .lp-editor h6 {
    font-size: 1rem;
  }

  .lp-editor a {
    text-decoration: underline;
  }

  .lp-editor hr {
    padding-top: 0.75em;
    margin: 0;
    border: none;
    border-top: 1px solid var(--color-border);
  }

  .lp-editor section {
    padding: 0;
    padding-top: var(--spacingTop);
    padding-bottom: var(--spacingBottom);
    text-align: justify;
    line-height: 25px;
  }

  .lp-editor h1 + section {
    padding-top: var(--spacingTop);
  }

  .lp-editor h2 + section,
  .lp-editor h3 + section,
  .lp-editor h4 + section {
    padding-top: var(--spacingTopSmall);
  }

  .lp-editor h1 + .lp-editor h2,
  .lp-editor h2 + .lp-editor h3,
  .lp-editor h3 + .lp-editor h4 {
    padding-top: var(--spacingTop);
  }
  .lp-editor ol,
  .lp-editor ul {
    padding-left: 2em;
  }
  .lp-editor ol ol,
  .lp-editor ol ul,
  .lp-editor ul ol,
  .lp-editor ul ul {
    margin-bottom: 0;
    margin-top: 0;
  }
  .lp-editor li {
    word-wrap: break-all;
  }
  .lp-editor li > .lp-editor p {
    margin-top: 8px;
  }
  .lp-editor li + .lp-editor li {
    margin-top: 0.25em;
  }

  .lp-editor blockquote,
  .lp-editor dl,
  .lp-editor ol,
  .lp-editor pre,
  .lp-editor table,
  .lp-editor ul {
    margin-bottom: 16px;
    margin-top: 0;
  }
  .lp-editor .code-block {
    background: black;
    display: block;
    padding: 10px;
    font-size: medium;
  }
  .lp-editor .code-block pre {
    padding: 0px;
    margin-bottom: 0px;
  }
  .lp-editor blockquote {
    border-left: 0.25em solid var(--color-border);
    padding: 0 1em;
  }
  .lp-editor blockquote > :first-child {
    margin-top: 0;
  }
  .lp-editor blockquote > :last-child {
    margin-bottom: 0;
  }
  .lp-editor code {
    padding: 0.5em 1em;
    white-space: nowrap;
  }
  .lp-editor code.code-block {
    display: block;
    overflow-x: auto;
    padding: 0.5em 1em;
    line-height: 1.4em;
    color: #c5c8c6;
    background: #131b1f;
    border-radius: 4px;
    border: 1px solid #283237;
  }

  .lp-editor code pre {
    -webkit-font-smoothing: initial;
    font-size: 13px;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    tab-size: 4;
    hyphens: none;
    padding: 0px;
    margin: 0;
  }
`;
const ArticleHolder = styled.div`
  max-width: 768px;
  width: 100%;
  margin: auto;
`;
