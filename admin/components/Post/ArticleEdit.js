import React, { Component } from "react";
import PropTypes from "prop-types";

import Editor from "./Editor";
import PostActions from "./PostActions";
import ContentEditable from "./ContentEditable";
import styled from "styled-components";

const Article = styled.article`
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    div[contenteditable="true"] {
        height: 100%;
        min-height: 100vh;
    }
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
            <React.Fragment>
                <Article className="post">
                    <div className="post-header">
                        <ContentEditable
                            title={this.props.post.title}
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
            </React.Fragment>
        );
    }
}
