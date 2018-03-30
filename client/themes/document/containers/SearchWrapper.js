import React, { Component } from "react";
import { graphql } from "react-apollo";
import ArticleListItem from "../components/Post/ArticleListItem";
import appoloClient from "client/apolloClient";
import config from "config";
import Loader from "../components/Loader";
import { SEARCH_POSTS_BY_TAXONOMY, SEARCH_POSTS } from "shared/queries/Queries";
import Paginate from "client/helpers/Paginate";
import OhSnap from "client/helpers/OhSnap";

export default class SearchWrapper extends Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.state = {
            loading: true,
            posts: [],
            pageNo: {
                category: 1,
                tag: 1,
                post: 1
            },
            total: 0
        };
    }

    componentDidMount() {
        this.loadData();
        document.body.classList.add("search-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("search-page");
    }

    async loadData(num = 1) {
        const term = this.props.type;
        const offset = (num - 1) * config.itemsPerPage;
        if (term === "post") {
            let result = await appoloClient.query({
                query: SEARCH_POSTS,
                variables: {
                    query:
                        '{ "like": "%' + this.props.match.params.query + '%" }',
                    limit: config.itemsPerPage,
                    offset: offset
                }
            });
            this.setState({
                loading: false,
                posts: [...this.state.posts, ...result.data.posts.rows],
                total: result.data.posts.count,
                pageNo: {
                    ...this.state.pageNo,
                    post: num
                }
            });
        } else if (term === "category") {
            let result = await appoloClient.query({
                query: SEARCH_POSTS_BY_TAXONOMY,
                variables: {
                    type: "post_category",
                    slug: this.props.match.params.query,
                    postType: "post",
                    limit: config.itemsPerPage,
                    offset: offset
                }
            });
            this.setState({
                loading: false,
                posts: [
                    ...this.state.posts,
                    ...result.data.postsByTaxSlug.posts
                ],
                total: result.data.postsByTaxSlug.count,
                pageNo: {
                    ...this.state.pageNo,
                    category: num
                }
            });
        } else if (term === "tag") {
            let result = await appoloClient.query({
                query: SEARCH_POSTS_BY_TAXONOMY,
                variables: {
                    type: "post_tag",
                    query: this.props.match.params.query,
                    postType: "post",
                    limit: config.itemsPerPage,
                    offset: offset
                }
            });
            this.setState({
                loading: false,
                posts: result.data.postsByTaxSlug.posts,
                total: result.data.postsByTaxSlug.count,
                pageNo: {
                    ...this.state.pageNo,
                    tag: num
                }
            });
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader />;
        }
        const posts = this.state.posts.map((post, i) => (
            <ArticleListItem idx={i} key={i} post={post} />
        ));
        if (posts.length === 0) {
            return (
                <OhSnap message="We couldn't find anything related to your search" />
            );
        }
        const data = (
            <div className="post-row col-lg-8 col-lg-offset-2">{posts}</div>
        );
        const type = this.props.type;

        return (
            <Paginate
                data={data}
                count={this.state.total}
                page={this.state.pageNo[type]}
                loadMore={this.loadData}
            />
        );
    }
}
