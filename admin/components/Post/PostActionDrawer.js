import React, { Component } from "react";
import PropTypes from "prop-types";

import { FeaturedImage, Tags, Categories, Excerpt } from "./";

class PostActionDrawer extends Component {
    static propTypes = {
        toggleActionDrawer: PropTypes.func,
        updatePost: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        create: PropTypes.bool,
        toggleFileExplorerModal: PropTypes.func,
        post: PropTypes.object,
        changePostStatus: PropTypes.func.isRequired,
        isPublished: PropTypes.bool.isRequired
    };

    getButton = (label, btnType = "btn-primary", status) => {
        if (typeof status == "undefined") {
            status = this.props.isPublished ? "publish" : "draft";
        }
        if (status)
            return (
                <div className="btn-item">
                    <button
                        type="submit"
                        onClick={e =>
                            this.props.updatePost(e, { status: status })
                        }
                        className={"publish-btn btn btn-sm " + btnType}
                    >
                        {label}
                    </button>
                </div>
            );
    };
    render() {
        if (!this.props.isOpen) return null;
        const post = this.props.post;
        const classes = this.props.isOpen ? " open" : "";
        const actionLabel = this.props.create ? "Create" : "Update";
        return (
            <div className={classes}>
                <span className="switch-label switch-off-text">Draft</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        onChange={this.props.changePostStatus}
                        checked={this.props.isPublished}
                    />
                    <span className="slider round" />
                </label>
                <span className="switch-label switch-on-text">Publish</span>
                <hr />
                <Excerpt post={post} />
                <hr />
                {post.type == "post" && <Tags post={post} />}
                {post.type == "post" && <Categories post={post} />}
                <FeaturedImage
                    post={post}
                    toggleFileExplorerModal={this.props.toggleFileExplorerModal}
                />
                <hr />
                {this.getButton(actionLabel, "btn-primary")}
            </div>
        );
    }
}

export default PostActionDrawer;
