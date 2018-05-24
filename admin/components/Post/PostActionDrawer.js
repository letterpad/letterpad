import React, { Component } from "react";
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
                    <i className="fa fa-close" />
                </Link>
                <PostMeta post={this.props.post} />
                <Tags post={this.props.post} />
                <Categories post={this.props.post} />
                <Excerpt post={this.props.post} />
                <FeaturedImage
                    post={this.props.post}
                    toggleFileExplorerModal={this.props.toggleFileExplorerModal}
                />
            </div>
        );
    }
}

export default PostActionDrawer;
