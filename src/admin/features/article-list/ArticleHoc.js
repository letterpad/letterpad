import React, { Component } from "react";
import PropTypes from "prop-types";

import appoloClient from "shared/apolloClient";
import { GET_POSTS } from "../../../shared/queries/Queries";
import { BULK_DELETE_POSTS } from "../../../shared/queries/Mutations";

const ArticleHoc = WrappedComponent => {
  const isAdmin = true;
  return class extends Component {
    static propTypes = {
      type: PropTypes.string.required,
      router: PropTypes.object,
    };

    state = {
      loading: true,
      selectedPosts: [],
      allPostsSelected: false,
    };

    componentDidMount() {
      this.fetchPosts();
    }

    fetchPosts = async () => {
      this.setState({ loading: true });
      const query = new URLSearchParams(
        this.props.router.history.location.search,
      );
      const params = Object.fromEntries(query);
      if (params.cursor) {
        params.cursor = parseInt(params.cursor);
      }
      if (params.page) {
        params.page = parseInt(params.page);
      }
      if (params.limit) {
        params.limit = parseInt(params.limit);
      }
      let result = await appoloClient(isAdmin).query({
        query: GET_POSTS,
        variables: { filters: { ...params, type: this.props.type } },
        forceFetch: true,
        fetchPolicy: "no-cache",
      });
      this.setState({
        posts: result.data.posts,
        loading: false,
      });
    };

    changePage = (e, page) => {
      e.preventDefault();
      if (!this.state.isSearch) {
        this.router.history.this.fetchPosts(page);
      } else {
        this.searchPosts(this.variables.query, page, this.variables.status);
      }
    };

    deletePosts = async ids => {
      const isAdmin = true;
      const urlQuery = new URLSearchParams(
        this.props.router.history.location.search,
      );
      const deleteFromSystem = urlQuery.get("status") === "trash";
      return appoloClient(isAdmin).mutate({
        mutation: BULK_DELETE_POSTS,
        variables: { ids: ids, deleteFromSystem },
        update: (proxy, { data: { deletePosts } }) => {
          if (deletePosts.ok) {
            this.fetchPosts();
          }
        },
      });
    };

    deleteSelectedPosts = () => {
      this.deletePosts(this.state.selectedPosts).then(() => {
        this.setState({ selectedPosts: [], allPostsSelected: false });
      });
    };

    selectAllPosts = (e, posts) => {
      let selectedPosts = [];
      let allPostsSelected = false;
      if (e.target.checked) {
        selectedPosts = posts.rows.map(post => post.id);
        allPostsSelected = true;
      }
      this.setState({ selectedPosts, allPostsSelected });
    };

    setSelection = id => {
      const idx = this.state.selectedPosts.indexOf(id);
      if (idx === -1) {
        this.state.selectedPosts.push(id);
      } else {
        this.state.selectedPosts.splice(idx, 1);
      }
      this.setState(this.state);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          changePage={this.changePage}
          fetchPosts={this.fetchPosts}
          selectAllPosts={this.selectAllPosts}
          deleteSelectedPosts={this.deleteSelectedPosts}
          setSelection={this.setSelection}
        />
      );
    }
  };
};

export default ArticleHoc;
