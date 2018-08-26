import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledSwitch from "../../../components/switch";
import StyledDropdown from "./Dropdown.css";

import Excerpt from "./Excerpt";
import FeaturedImage from "../FeaturedImage";
import Taxonomies from "./Taxonomies";
import PostActions from "../PostActions";

class PublishDropdown extends Component {
    static propTypes = {
        toggleDropdown: PropTypes.func,
        updatePost: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        create: PropTypes.bool,
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
                <div className="btn-item text-right">
                    <button
                        type="submit"
                        onClick={e => {
                            this.props.updatePost(e, { status: status });
                            this.props.toggleDropdown(e);
                        }}
                        className={"publish-btn btn btn-sm " + btnType}
                    >
                        {label}
                    </button>
                </div>
            );
    };
    render() {
        if (!this.props.isOpen) return null;
        const post = {
            ...this.props.post,
            body: PostActions.data.body
        };
        const classes = this.props.isOpen ? " open" : "";
        const actionLabel = this.props.create ? "Create" : "Update";
        return (
            <StyledDropdown className={classes}>
                <div>{this.getButton(actionLabel, "btn-primary")}</div>
                <StyledSwitch
                    leftLabel="Draft"
                    rightLabel="Publish"
                    onChange={this.props.changePostStatus}
                    isSelected={this.props.isPublished}
                />

                <hr />
                <Excerpt post={post} />
                <hr />
                {post.type == "post" && (
                    <Taxonomies post={post} for="post_tag" />
                )}
                {post.type == "post" && (
                    <Taxonomies post={post} for="post_category" />
                )}
                <FeaturedImage post={post} />
            </StyledDropdown>
        );
    }
}

export default PublishDropdown;
