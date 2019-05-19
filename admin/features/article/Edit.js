import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledArticle from "./Article.css";

import Editor from "./editor";
import PostActions from "./PostActions";
import PostTitle from "./PostTitle";

export default class Edit extends Component {
  static propTypes = {
    post: PropTypes.object,
    theme: PropTypes.string,
  };

  render() {
    const { post } = this.props;
    return (
      <StyledArticle className={post.type}>
        <div className="post-header">
          <PostTitle
            text={post.title}
            placeholder="Enter a title"
            onChange={e => {
              PostActions.setData({
                title: e.target.value,
              });
            }}
          />
        </div>
        <div className="post-content">
          <Editor post={post} theme={this.props.theme} />
        </div>
      </StyledArticle>
    );
  }
}
