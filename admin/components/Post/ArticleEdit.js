import React, { Component } from "react";
import Editor from "./Editor";
import PostActions from "./PostActions";
import ContentEditable from "./ContentEditable";
import PropTypes from "prop-types";
import styled from "styled-components";

const Article = styled.article`
    display: flex;
    flex: 1;
    flex-direction: column;
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
                    <div className="post-content" style={{ flex: 1 }}>
                        <Editor isMarkdown={false} {...this.props.post} />
                    </div>
                </Article>
            </React.Fragment>
        );
    }
}
