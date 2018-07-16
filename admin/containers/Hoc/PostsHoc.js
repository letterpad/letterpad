import React, { Component } from "react";
import { SEARCH_POSTS, GET_POSTS } from "../../../shared/queries/Queries";
import appoloClient from "shared/apolloClient";
import { BULK_DELETE_POSTS } from "../../../shared/queries/Mutations";

const PostsHoc = (WrappedComponent, type) => {
    const isAdmin = true;
    return class extends Component {
        state = {
            status: "publish",
            page: 1,
            isSearch: false,
            loading: true,
            selectedPosts: [],
            allPostsSelected: false
        };

        variables = {
            type: type,
            limit: 20,
            offset: (parseInt(this.state.page) - 1) * 20,
            status: this.state.status,
            query: null
        };

        componentDidMount() {
            this.fetchPosts();
        }

        fetchPosts = async (page = 1) => {
            this.setState({ loading: true });
            this.variables.offset = (parseInt(page) - 1) * 20;
            let result = await appoloClient(isAdmin).query({
                query: GET_POSTS,
                variables: this.variables,
                forceFetch: true,
                fetchPolicy: "no-cache"
            });
            this.setState({
                page: page,
                isSearch: false,
                status: this.variables.status,
                posts: result.data.posts,
                loading: false
            });
        };

        changeStatus = status => {
            this.variables.status = status;
            if (!this.state.isSearch) {
                this.fetchPosts();
            } else {
                this.searchPosts(
                    this.variables.query,
                    this.state.page,
                    this.variables.status
                );
            }
            this.setState({ status });
        };

        changePage = (e, page) => {
            e.preventDefault();
            if (!this.state.isSearch) {
                this.fetchPosts(page);
            } else {
                this.searchPosts(
                    this.variables.query,
                    page,
                    this.variables.status
                );
            }
        };

        deletePosts = async ids => {
            return appoloClient.mutate({
                mutation: BULK_DELETE_POSTS,
                variables: { ids: ids.join(",") },
                update: (proxy, { data: { deletePosts } }) => {
                    if (deletePosts.ok) {
                        this.fetchPosts();
                    }
                }
            });
        };

        searchPosts = async (query, page = 1, status = "all") => {
            if (query === "") {
                this.variables.status = "publish";
                return this.setState({ status: "publish" }, () => {
                    this.fetchPosts();
                });
            }
            this.setState({ loading: true });
            this.variables.query = query;
            this.variables.status = status;
            this.variables.offset = (parseInt(page) - 1) * 20;
            let result = await appoloClient(isAdmin).query({
                query: SEARCH_POSTS,
                variables: {
                    ...this.variables,
                    query: `{ "like": "%${query}%" }`
                }
            });
            this.setState({
                page: page,
                isSearch: true,
                status: status,
                posts: result.data.posts,
                loading: false
            });

            return result.data.posts.rows;
        };
        deletedSelectedPosts = () => {
            this.deletePosts(this.state.selectedPosts).then(() => {
                this.setState({ selectedPosts: [], allPostsSelected: false });
            });
        };

        selectAllPosts = (e, posts) => {
            let selectedPosts = [];
            if (e.target.checked) {
                selectedPosts = posts.rows.map(post => post.id);
            }
            this.setState({ selectedPosts, allPostsSelected: true });
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
                    changeStatus={this.changeStatus}
                    changePage={this.changePage}
                    searchPosts={this.searchPosts}
                    selectAllPosts={this.selectAllPosts}
                    deletedSelectedPosts={this.deletedSelectedPosts}
                    setSelection={this.setSelection}
                />
            );
        }
    };
};

export default PostsHoc;
