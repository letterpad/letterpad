import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import util from "../../../../shared/util";
import PostActions from "../PostActions";
import StyledDropdown from "./Dropdown.css";

import StyledInput from "../../../components/input";
import StyledButton from "../../../components/button";
import { Post } from "../../../../__generated__/gqlTypes";

interface IMetaDropdownProps {
  close: (e: React.SyntheticEvent) => void;
  post: Post;
  updatePost: (post: Post) => void;
}

class MetaDropdown extends Component<IMetaDropdownProps, any> {
  state = {
    post: this.props.post,
  };

  static getDerivedStateFromProps(newProps: IMetaDropdownProps) {
    return {
      post: newProps.post,
    };
  }

  changeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      post: { ...this.state.post, slug: e.target.value },
    });
    PostActions.setData({ slug: e.target.value });
  };

  render() {
    const permalink = util.makeUrl([
      this.state.post.type,
      this.state.post.slug,
    ]);
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
          defaultValue={this.state.post.slug}
          onChange={this.changeSlug}
        />

        <StyledInput
          type="text"
          label="Preview"
          className="meta-value"
          placeholder="Link to post"
          defaultValue={permalink}
          onClick={() => {
            window.open(permalink);
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
