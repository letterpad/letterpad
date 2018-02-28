import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { INSERT_MEDIA } from "../../../shared/queries/Mutations";
import MarkdownEditor from "./Editors/MarkdownEditor";
import Normal from "./Editors/Normal";
import PostActions from "./PostActions";

class Editor extends Component {
    constructor(props) {
        super(props);
        this.changeEditor = this.changeEditor.bind(this);
        this.state = {
            markdownEditor: this.props.mode == "markdown"
        };
    }

    changeEditor(e) {
        const mode = e.target.checked ? "markdown" : "standard";
        PostActions.setData({ mode });
        this.setState({ markdownEditor: ~~e.target.checked });
    }

    render() {
        return (
            <div>
                <div className={"switch-block m-b-20 "}>
                    <span className="switch-label switch-off-text">Simple</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={this.changeEditor}
                            checked={this.state.markdownEditor}
                        />
                        <span className="slider round" />
                    </label>
                    <span className="switch-label switch-on-text">
                        Markdown
                    </span>
                </div>
                {this.state.markdownEditor ? (
                    <MarkdownEditor body={this.props.body} />
                ) : (
                    <Normal
                        body={this.props.body}
                        insertMedia={this.props.insertMedia}
                    />
                )}
            </div>
        );
    }
}

Editor.propTypes = {
    insertMedia: PropTypes.func,
    body: PropTypes.string
};

const insertMedia = graphql(INSERT_MEDIA, {
    props: ({ mutate }) => {
        return {
            insertMedia: data => {
                mutate({
                    variables: data
                });
            }
        };
    }
});
export default insertMedia(Editor);
