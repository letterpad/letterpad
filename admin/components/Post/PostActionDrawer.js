import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FeaturedImage, Tags, Categories, Excerpt, PostMeta } from "./";

class PostActionDrawer extends Component {
    render() {
        const post = this.props.post;
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
                <PostMeta post={post} />
                {post.type == "post" && <Tags post={post} />}
                {post.type == "post" && <Categories post={post} />}

                <Excerpt post={post} />
                <FeaturedImage
                    post={post}
                    toggleFileExplorerModal={this.props.toggleFileExplorerModal}
                />
            </div>
        );
    }
}
PostActionDrawer.propTypes = {
    toggleActionDrawer: PropTypes.func,
    isOpen: PropTypes.bool,
    toggleFileExplorerModal: PropTypes.func,
    post: PropTypes.object
};
export default PostActionDrawer;
