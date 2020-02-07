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
  updatePost: (post: Post) => void;
}

class MetaDropdown extends Component<IMetaDropdownProps, any> {
  state = {
    post: {
      ...this.props.post,
      cover_image: this.props.post.cover_image.replace(host, ""),
    },
  };

  static getDerivedStateFromProps(newProps: IMetaDropdownProps) {
    return {
      post: {
        ...newProps.post,
        cover_image: newProps.post.cover_image.replace(host, ""),
      },
    };
  }

  changeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      post: {
        ...this.state.post,
        slug: e.target.value,
      },
    });
    PostActions.setData({ slug: e.target.value });
  };

  render() {
    const previewUrl = `${host}${this.state.post.slug}`;
    return (
      <StyledDropdown className="post-meta">
        <StyledInput
          type="text"
          label="Published at"
          className="meta-value"
          placeholder="Published date"
          defaultValue={moment(this.state.post.createdAt).format(
            "DD-MM-Y hh:mm A",
          )}
        />

        <StyledInput
          type="text"
          label="Change Path"
          className="meta-value"
          placeholder="Link to post"
          defaultValue={this.state.post.slug
            .replace("/post/", "")
            .replace("/page/", "")}
          onChange={this.changeSlug}
        />

        <StyledInput
          type="text"
          label="Preview"
          className="meta-value"
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
            this.props.updatePost(this.state.post);
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
