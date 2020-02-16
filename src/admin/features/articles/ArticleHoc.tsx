import React, { Component } from "react";

import appoloClient from "../../../shared/apolloClient";
import { QUERY_POSTS } from "../../../shared/queries/Queries";
import { BULK_DELETE_POSTS } from "../../../shared/queries/Mutations";
import { RouteComponentProps } from "react-router";
import { PostTypes } from "../../../__generated__/gqlTypes";

interface IArticleProps {
  type: PostTypes;
  router: RouteComponentProps;
}

interface IArticleState {
  loading: boolean;
  selectedPosts: string[];
  allPostsSelected: boolean;
  posts: any;
}

const ArticleHoc = <P extends IArticleProps>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const isAdmin = true;
  return class extends Component<P, IArticleState> {
    state: IArticleState = {
      loading: true,
      selectedPosts: [],
      allPostsSelected: false,
      posts: [],
    };

    componentDidMount() {
      this.fetchPosts();
    }

    fetchPosts = async () => {
      this.setState({ loading: true });
      const query: any = new URLSearchParams(
        this.props.router.history.location.search,
      );
      const params: any = (Object as any).fromEntries(query);
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
        query: QUERY_POSTS,
        variables: { filters: { ...params, type: this.props.type } },
        fetchPolicy: "no-cache",
      });
      this.setState({
        posts: result.data.posts,
        loading: false,
      });
    };

    changePage = (e, _page) => {
      e.preventDefault();
      // if (!this.state.isSearch) {
      //   this.props.router.history.this.fetchPosts(page);
      // } else {
      this.fetchPosts();
      // }
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
        update: (_proxy, { data: { deletePosts } }) => {
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
      let selectedPosts: Array<string> = [];
      let allPostsSelected = false;
      if (e.target.checked) {
        selectedPosts = posts.rows.map(post => post.id);
        allPostsSelected = true;
      }
      this.setState({ selectedPosts, allPostsSelected });
    };

    setSelection = (id: string) => {
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
