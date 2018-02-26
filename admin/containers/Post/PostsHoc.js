import React, { Component } from "react";
import { SEARCH_POSTS, GET_POSTS } from "../../../shared/queries/Queries";
import { graphql } from "graphql/graphql";
import appoloClient from "../../apolloClient";
import config from "../../../config";

const PostsHoc = (WrappedComponent, type) => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.changePage = this.changePage.bind(this);
            this.changeStatus = this.changeStatus.bind(this);
            this.searchPosts = this.searchPosts.bind(this);
            this.state = {
                status: "publish",
                page: 1,
                isSearch: false,
                loading: true
            };
            this.variables = {
                type: type,
                limit: 20,
                offset: (parseInt(this.state.page) - 1) * 20,
                status: this.state.status,
                query: null
            };
        }

        componentDidMount() {
            this.fetchPosts();
        }

        async fetchPosts(page = 1) {
            this.setState({ loading: true });
            this.variables.offset = (parseInt(page) - 1) * 20;
            let result = await appoloClient.query({
                query: GET_POSTS,
                variables: this.variables,
                forceFetch: true,
                fetchPolicy: "network-only"
            });
            this.setState({
                page: page,
                isSearch: false,
                status: this.variables.status,
                posts: result.data.posts,
                loading: false
            });
        }

        changeStatus(status) {
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
        }

        changePage(e, page) {
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
        }

        async searchPosts(query, page = 1, status = "all") {
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
            let result = await appoloClient.query({
                query: SEARCH_POSTS,
                variables: {
                    ...this.variables,
                    query: '{ "like": "%' + query + '%" }'
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
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    changeStatus={this.changeStatus}
                    changePage={this.changePage}
                    searchPosts={this.searchPosts}
                />
            );
        }
    };
};

export default PostsHoc;
