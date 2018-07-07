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
            <React.Fragment>
                <Article className="post">
                    <div className="post-header">
                        <ContentEditable
                            placeholder="Enter a title"
                            title=""
                            onChange={e => {
                                if (e.target.value !== "") {
                                    PostActions.setData({
                                        title: e.target.value
                                    });
                                }
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
