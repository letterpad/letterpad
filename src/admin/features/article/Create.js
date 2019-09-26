import React, { Component } from "react";
import PropTypes from "prop-types";

import PostActions from "./PostActions";
import CreatePost from "../../data-connectors/CreatePost";
import { plural } from "../../../shared/util";
import Loader from "../../components/loader";

export class Create extends Component {
  static propTypes = {
    history: PropTypes.object,
    createPost: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  state = {
    post: {},
  };

  componentDidMount() {
    const { type } = this.props;
    // This is going to hold all the changes done to the post.
    PostActions.data = {};
    // create an empty post with the type and title
    this.props.createPost({ type }).then(result => {
      const post = result.data.createPost.post;
      PostActions.setData({ slug: post.slug });
      this.props.history.push(`/admin/${plural[type]}/${post.id}`);
    });
  }

  render() {
    // We will redirect the user to the edit page, so no need of a UI here.
    return <Loader />;
  }
}

export default CreatePost(Create);
