import {
  Post,
  PostStatusOptions,
  PostTypes,
  TaxonomyTypes,
} from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";

import Excerpt from "./Excerpt";
import FeaturedImage from "../FeaturedImage";
import PostActions from "../PostActions";
import StyledDropdown from "./Dropdown.css";
import StyledSwitch from "../../../components/switch";
import Taxonomies from "./Taxonomies";

interface IProps {
  updatePost: (data?: object) => void;
  post: Post;
  toggleVisibility: (e?: Event, flag?: boolean) => void;
  isPublished: boolean;
}
class PublishDropdown extends Component<IProps> {
  onStatusChange = (status: boolean) => {
    const statusText: PostStatusOptions = status
      ? PostStatusOptions.Publish
      : PostStatusOptions.Draft;

    PostActions.setData({ status: statusText });
    this.props.updatePost();
  };
  render() {
    const post = {
      ...this.props.post,
      html: PostActions.getData().html,
      taxonomies: PostActions.getData().taxonomies,
    };
    const { isPublished, toggleVisibility, updatePost } = this.props;

    return (
      <StyledDropdown>
        <StyledSwitch
          leftLabel="Draft"
          rightLabel="Publish"
          onChange={this.onStatusChange}
          isSelected={isPublished}
        />

        <hr />
        <Excerpt
          html={post.html}
          excerpt={post.excerpt}
          updatePost={updatePost}
        />
        <hr />
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={toggleVisibility}
            post={post}
            for={TaxonomyTypes.PostTag}
            suggestions={[]}
            updatePost={updatePost}
          />
        )}
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={toggleVisibility}
            post={post}
            for={TaxonomyTypes.PostCategory}
            suggestions={[]}
            updatePost={updatePost}
          />
        )}
        <FeaturedImage post={post} />
        <br />
      </StyledDropdown>
    );
  }
}

export default PublishDropdown;
