import React, { Component } from "react";
import PropTypes from "prop-types";

class MdPreview extends Component {
    render() {
        if (this.props.post.mode == "rich-text") {
            return (
                <span className="no-preview">
                    Preview is only available for markdown editor
                </span>
            );
        }
        return (
            <div className="card">
                <article className="post">
                    <div className="post-header">
                        <h2 className="post-title">{this.props.post.title}</h2>
                    </div>

                    <div className="post-content">
                        <div
                            id="md-preview"
                            dangerouslySetInnerHTML={{
                                __html: this.props.preview
                            }}
                        />
                    </div>
                    <div className="footer">
                        <span>Preview</span>
                        <span>
                            Words:{" "}
                            {this.props.preview.trim().split(" ").length - 1}
                        </span>
                    </div>
                </article>
            </div>
        );
    }
}

MdPreview.propTypes = {
    post: PropTypes.object,
    preview: PropTypes.string
};

export default MdPreview;
