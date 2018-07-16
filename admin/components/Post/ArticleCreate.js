import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import Editor from "./Editor";
import PostActions from "./PostActions";
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
`;
const TitleInput = styled.input`
    border: none;
    font-size: 30px;
    background: transparent;
    font-weight: 500;
    width: 100%;
    margin-bottom: 40px;
`;

const TitleInput = styled.input`
    width: 100%;
    border: none;
    background: transparent;
    font-size: 34px;
    margin-bottom: 20px;
    ::placeholder {
        font-weight: 500;
    }
`;

export default class CreateArticle extends Component {
    static propTypes = {
        title: PropTypes.string,
        post: PropTypes.object
    };

    state = {
        isMarkdown: false
    };

    render() {
        return (
            <Fragment>
                <Article className="post">
                    <div className="post-header">
                        <TitleInput
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
            </Fragment>
        );
    }
}
