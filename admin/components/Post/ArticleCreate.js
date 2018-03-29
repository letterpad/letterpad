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
        this.state = {
            isMarkdown: "rich-text"
        };
    }
    componentWillUnmount() {
        document.body.classList.remove("options-open");
    }

    changeEditor(e) {
        const mode = e.target.checked ? "markdown" : "rich-text";
        PostActions.setData({ mode });
        this.setState({ isMarkdown: ~~e.target.checked });
    }
    render() {
        return (
            <div className="card">
                <article className="post">
                    <div className="post-header">
                        <div style={{ flex: 1 }}>
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
                        </div>
                    </div>
                    <div className="post-content">
                        <Editor
                            isMarkdown={this.state.isMarkdown}
                            body=""
                            mdBody=""
                        />
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
