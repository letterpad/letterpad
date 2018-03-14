import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import Editor from "./Editor";
import PostActions from "./PostActions";
import ContentEditable from "./ContentEditable";

export default class CreateArticle extends Component {
    constructor(props) {
        super(props);
        this.changeEditor = this.changeEditor.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.state = {
            isMarkdown: "standard"
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
                        <div className="post-meta">
                            {moment(new Date()).format("LL")}
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
                        <Editor body="" />
                    </div>
                </article>
            </div>
        );
    }
}

CreateArticle.propTypes = {
    title: PropTypes.string,
    post: PropTypes.object
};
