import React, { Component } from "react";
import moment from "moment";
import Editor from "./Editor";
import PostActions from "./PostActions";
import FeaturedImage from "./FeaturedImage";
import ContentEditable from "./ContentEditable";
import PropTypes from "prop-types";

export default class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        this.changeEditor = this.changeEditor.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.state = {
            isMarkdown: this.props.post.mode == "markdown"
        };
    }
    toggleFullScreen() {
        const isDistractFree = document.body.classList.contains(
            "distract-free"
        );
        if (isDistractFree) {
            document.body.classList.remove("distract-free");
        } else {
            document.body.classList.add("distract-free");
        }
    }
    changeEditor(e) {
        const mode = e.target.checked ? "markdown" : "standard";
        PostActions.setData({ mode });
        this.setState({ isMarkdown: ~~e.target.checked });
    }
    render() {
        return (
            <div className="card">
                <article className="post">
                    <FeaturedImage post={this.props.post} />
                    <div className="post-header">
                        <div>
                            <ContentEditable
                                title={this.props.post.title}
                                placeholder="Enter a title"
                                onChange={e => {
                                    PostActions.setData({
                                        title: e.target.value
                                    });
                                }}
                            />
                            <div className="post-meta">
                                {moment(
                                    new Date(this.props.post.created_at)
                                ).format("LL")}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="switch-block">
                                <span className="switch-label switch-off-text">
                                    Rich Text
                                </span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={this.changeEditor}
                                        checked={this.state.isMarkdown}
                                    />
                                    <span className="slider round" />
                                </label>
                                <span className="switch-label switch-on-text">
                                    Markdown
                                </span>
                            </div>
                            <div
                                className="full-screen pointer"
                                onClick={this.toggleFullScreen}
                            >
                                <img
                                    src="https://www.materialui.co/materialIcons/navigation/fullscreen_black_192x192.png"
                                    width="30"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="post-content">
                        <Editor
                            isMarkdown={this.state.isMarkdown}
                            mode={this.props.post.mode}
                            body={this.props.post.body}
                        />
                    </div>
                </article>
            </div>
        );
    }
}

ArticleEdit.propTypes = {
    post: PropTypes.object
};
