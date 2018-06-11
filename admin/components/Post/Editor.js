import React, { Component } from "react";
import PropTypes from "prop-types";
import MarkdownEditor from "./Editors/MarkdownEditor";
import RichText from "./Editors/RichText";
import InsertMedia from "../../data-connectors/InsertMedia";

class Editor extends Component {
    static propTypes = {
        insertMedia: PropTypes.func,
        body: PropTypes.string,
        mdBody: PropTypes.string,
        isMarkdown: PropTypes.bool
    };
    render() {
        return (
            <div className="fs-normal">
                {this.props.isMarkdown ? (
                    <MarkdownEditor
                        body={this.props.body}
                        mdBody={this.props.mdBody}
                    />
                ) : (
                    <RichText
                        body={this.props.body}
                        insertMedia={this.props.insertMedia}
                    />
                )}
            </div>
        );
    }
}

export default InsertMedia(Editor);
