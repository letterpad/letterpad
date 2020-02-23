import React, { Component } from "react";

import { Post } from "../../../../__generated__/gqlTypes";
import PostActions from "../PostActions";
import StyledButton from "../../../components/button";
import StyledDropdown from "./Dropdown.css";
import StyledInput from "../../../components/input";
import config from "../../../../config";
import moment from "moment";

const host = config.ROOT_URL + config.BASE_NAME;

interface IMetaDropdownProps {
  close: (e: React.SyntheticEvent) => void;
  post: Post;
  updatePost: ({
    publishedAt,
    slug,
  }: {
    publishedAt: string;
    slug: string;
  }) => void;
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

  changeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      slug: e.target.value,
    });
    PostActions.setData({ slug: e.target.value });
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
          defaultValue={moment(this.props.post.createdAt).format(
            "DD-MM-Y hh:mm A",
          )}
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

        <StyledButton
          success
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault();
            this.props.updatePost({ publishedAt, slug });
            this.props.close(e);
          }}
        >
          Save
        </StyledButton>
      </StyledDropdown>
    );
  }
}

export default MetaDropdown;
