import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FeaturedImage, Tags, Categories, Excerpt, PostMeta } from "./";

class PostActionDrawer extends Component {
    render() {
        const classes = this.props.isOpen ? " open" : "";
        return (
            <div className={"post-action-drawer" + classes}>
                <Link
                    to="#"
                    onClick={this.props.toggleActionDrawer}
                    className="close-action-drawer"
                >
                    ✕
                </Link>
                <PostMeta post={this.props.post} />
                {this.props.post.type == "post" && (
                    <Tags post={this.props.post} />
                )}
                {this.props.post.type == "post" && (
                    <Categories post={this.props.post} />
                )}

                <Excerpt post={this.props.post} />
                <FeaturedImage
                    post={this.props.post}
                    toggleFileExplorerModal={this.props.toggleFileExplorerModal}
                />
            </div>
        );
    }
}
PostActionDrawer.defaultProps = {
    toggleActionDrawer: PropTypes.func,
    isOpen: PropTypes.bool,
    toggleFileExplorerModal: PropTypes.func,
    post: PropTypes.object
};
export default PostActionDrawer;
