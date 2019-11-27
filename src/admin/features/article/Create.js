import React, { Component } from "react";
import PropTypes from "prop-types";

import PostActions from "./PostActions";
import { plural } from "../../../shared/util";
import Loader from "../../components/loader";
import apolloClient from "../../../shared/apolloClient";
import { CREATE_POST } from "../../../shared/queries/Mutations";

export class Create extends Component {
  static propTypes = {
    router: PropTypes.object,
    createPost: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  state = {
    post: {},
  };

  async componentDidMount() {
    const { type } = this.props;
    // This is going to hold all the changes done to the post.
    PostActions.data = {};
    const result = await apolloClient(true).mutate({
      mutation: CREATE_POST,
      variables: { data: { type } },
    });
    const post = result.data.createPost.post;
    PostActions.setData({ slug: post.slug });
    this.props.router.history.replace(`/admin/${plural[type]}/${post.id}`);
  }

  render() {
    // We will redirect the user to the edit page, so no need of a UI here.
    return <Loader />;
  }
}

export default Create;
