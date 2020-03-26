import React, { Component } from "react";

import { Post } from "../../../../__generated__/gqlTypes";
import PostActions from "../PostActions";
import StyledDropdown from "./Dropdown.css";
import StyledInput from "../../../components/input";
import config from "../../../../config";
import { getDateTime } from "../../../../shared/date";

const host = config.ROOT_URL + config.BASE_NAME;

interface IMetaDropdownProps {
  close: (e: React.SyntheticEvent) => void;
  post: Post;
}

class MetaDropdown extends Component<IMetaDropdownProps, any> {
  state = {
    slug: this.props.post.slug,
    publishedAt: this.props.post.publishedAt,
  };

  static getDerivedStateFromProps(newProps: IMetaDropdownProps) {
    return {
      post: {
        ...newProps.post,
      },
    };
  }

  changeSlug = async (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      slug: e.target.value,
    });
    PostActions.setDraft({ slug: e.target.value });
    await PostActions.updatePost();
  };

  changePublishDate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      publishedAt: e.target.value,
    });
    PostActions.setDraft({ publishedAt: e.target.value });
    await PostActions.updatePost();
  };

  render() {
    const { slug, publishedAt } = this.state;

    const previewUrl = `${host}${slug}`;
    return (
      <StyledDropdown className="post-meta">
        <StyledInput
          type="text"
          label="Published at"
          className="meta-value"
          placeholder="Published date"
          defaultValue={getDateTime(publishedAt)}
          onChange={this.changePublishDate}
        />

        <StyledInput
          type="text"
          label="Change Path"
          className="meta-value"
          placeholder="Link to post"
          defaultValue={slug.replace("/post/", "").replace("/page/", "")}
          onChange={this.changeSlug}
        />

        <StyledInput
          type="text"
          label="Preview"
          className="meta-value pointer"
          placeholder="Link to post"
          defaultValue={previewUrl}
          onClick={() => {
            window.open(previewUrl);
          }}
        />
      </StyledDropdown>
    );
  }
}

export default MetaDropdown;
