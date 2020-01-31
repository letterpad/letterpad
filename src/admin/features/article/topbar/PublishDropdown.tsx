import React, { Component } from "react";

import Excerpt from "./Excerpt";
import FeaturedImage from "../FeaturedImage";
import PostActions from "../PostActions";
import PropTypes from "prop-types";
import StyledButton from "../../../components/button";
import StyledDropdown from "./Dropdown.css";
import StyledSwitch from "../../../components/switch";
import Taxonomies from "./Taxonomies";
import { TaxonomyTypes } from "../../../../__generated__/gqlTypes";

class PublishDropdown extends Component<any, any> {
  static propTypes = {
    close: PropTypes.func,
    updatePost: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    create: PropTypes.bool,
    post: PropTypes.object,
    changePostStatus: PropTypes.func.isRequired,
    isPublished: PropTypes.bool.isRequired,
  };

  getButton = (label, btnType = "btn-primary", status = "") => {
    if (status === "") {
      status = this.props.isPublished ? "publish" : "draft";
    }
    if (status)
      return (
        <div style={{ textAlign: "right" }}>
          <StyledButton
            sm
            success
            onClick={(e: React.SyntheticEvent) => {
              this.props.updatePost({ status: status });
              // this.props.close(e, false);
            }}
            className={"publish-btn btn btn-sm " + btnType}
          >
            {label}
          </StyledButton>
        </div>
      );
  };

  render() {
    const post = {
      ...this.props.post,
      body: PostActions.getData().body,
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
          <Taxonomies
            post={post}
            for={TaxonomyTypes.PostTag}
            suggestions={[]}
          />
        )}
        {post.type == "post" && (
          <Taxonomies
            post={post}
            for={TaxonomyTypes.PostCategory}
            suggestions={[]}
          />
        )}
        <FeaturedImage
          post={post}
          updateFeaturedImage={this.props.updatePost}
        />
        <br />
      </StyledDropdown>
    );
  }
}

export default PublishDropdown;
