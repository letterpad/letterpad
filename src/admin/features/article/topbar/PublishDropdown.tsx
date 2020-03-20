import {
  Post,
  PostStatusOptions,
  PostTypes,
  TaxonomyType,
} from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";

import Excerpt from "./Excerpt";
import FeaturedImage from "../FeaturedImage";
import { MediaProvider } from "../Edit";
import PostActions from "../PostActions";
import StyledDropdown from "./Dropdown.css";
import StyledSwitch from "../../../components/switch";
import Taxonomies from "./Taxonomies";

interface IProps {
  updatePost: (data?: object) => void;
  post: Post;
  toggleVisibility: (e?: Event, flag?: boolean) => void;
  // isPublished: boolean;
}
class PublishDropdown extends Component<IProps> {
  onStatusChange = async (status: boolean) => {
    const statusText: PostStatusOptions = status
      ? PostStatusOptions.Publish
      : PostStatusOptions.Draft;

    PostActions.setDraft({ status: statusText });
    await PostActions.updatePost();
    this.forceUpdate();
  };
  render() {
    const post = {
      ...PostActions.getData(),
    };
    const { toggleVisibility } = this.props;

    return (
      <StyledDropdown>
        <StyledSwitch
          leftLabel="Draft"
          rightLabel="Publish"
          onChange={this.onStatusChange}
          isSelected={post.status === PostStatusOptions.Publish}
        />

        <hr />
        <Excerpt html={post.html} excerpt={post.excerpt} />
        <hr />
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={toggleVisibility}
            post={post}
            for={TaxonomyType.PostTag}
            suggestions={[]}
          />
        )}
        {post.type === PostTypes.Post && (
          <Taxonomies
            toggleVisibility={toggleVisibility}
            post={post}
            for={TaxonomyType.PostCategory}
            suggestions={[]}
          />
        )}
        <FeaturedImage post={post} mediaProvider={MediaProvider.Unsplash} />
        <br />
      </StyledDropdown>
    );
  }
}

export default PublishDropdown;
