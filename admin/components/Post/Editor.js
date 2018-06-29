import React, { Component } from "react";
import PropTypes from "prop-types";
import MarkdownEditor from "./Editors/MarkdownEditor";
import SlateEditor from "./Editors/SlateEditor";
import InsertMedia from "../../data-connectors/InsertMedia";

class Editor extends Component {
    static propTypes = {
        insertMedia: PropTypes.func,
        body: PropTypes.string,
        mdBody: PropTypes.string,
        isMarkdown: PropTypes.any
    };
    render() {
        return (
            <React.Fragment>
                {this.props.isMarkdown ? (
                    <MarkdownEditor
                        body={this.props.body}
                        mdBody={this.props.mdBody}
                    />
                ) : (
                    <SlateEditor
                        body={this.props.body}
                        insertMedia={this.props.insertMedia}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default InsertMedia(Editor);
