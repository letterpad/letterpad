import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { INSERT_MEDIA } from "../../../shared/queries/Mutations";
import MarkdownEditor from "./Editors/MarkdownEditor";
import Normal from "./Editors/Normal";
import PostActions from "./PostActions";

class Editor extends Component {
    render() {
        return (
            <div className="fs-normal">
                {this.props.isMarkdown ? (
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
