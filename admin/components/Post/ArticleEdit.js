import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Editor from "./Editor";
import PostActions from "./PostActions";
import PostTitle from "./PostTitle";

const Article = styled.article`
    display: flex;
    flex: 1;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol";
    .post-content {
        flex: 1;
    }
`;

export default class ArticleEdit extends Component {
    static propTypes = {
        post: PropTypes.object
    };

    render() {
        return (
            <Fragment>
                <Article className="post">
                    <div className="post-header">
                        <PostTitle
                            text={this.props.post.title}
                            placeholder="Enter a title"
                            onChange={e => {
                                PostActions.setData({
                                    title: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className="post-content">
                        <Editor isMarkdown={false} {...this.props.post} />
                    </div>
                </Article>
            </Fragment>
        );
    }
}
