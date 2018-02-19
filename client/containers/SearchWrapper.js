import React, { Component } from "react";
import { graphql } from "react-apollo";
import ArticleList from "../components/post/ArticleList";
import appoloClient from "../apolloClient";
import config from "../../config";
import Loader from "../components/Loader";
import {
    SEARCH_POSTS_BY_TAXONOMY,
    SEARCH_POSTS
} from "../../shared/queries/Queries";
import Paginate from "../components/Paginate";

//export default function SearchWrapper(params) {

export default class SearchMe extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
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
    }

    async loadData() {
        const term = this.props.type;
        const offset = (this.state.pageNo[term] - 1) * config.itemsPerPage;
        if (term === "post") {
            let result = await appoloClient.query({
                query: SEARCH_POSTS,
                variables: {
                    type: "post",
                    query:
                        '{ "like": "%' + this.props.match.params.query + '%" }',
                    limit: config.itemsPerPage,
                    offset: offset
                }
            });
            this.setState({
                loading: false,
                posts: result.data.posts.rows,
                total: result.data.posts.count,
                pageNo: {
                    ...this.state.pageNo,
                    post: this.state.pageNo.post
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
                posts: result.data.taxonomyBySlug[0].posts,
                total: result.data.taxonomyBySlug[0].post_count,
                pageNo: {
                    ...this.state.pageNo,
                    category: this.state.pageNo.category
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
                posts: result.data.taxonomyBySlug[0].posts,
                total: result.data.taxonomyBySlug[0].post_count,
                pageNo: {
                    ...this.state.pageNo,
                    tag: this.state.pageNo.tag
                }
            });
        }
    }

    changePage(e, num) {
        e.preventDefault();
        const newState = {
            pageNo: { ...this.state.pageNo }
        };
        newState.pageNo[this.props.type] = num;
        this.setState(newState, () => {
            this.loadData();
        });
    }

    render() {
        if (this.state.loading) {
            return <Loader />;
        }
        const data = this.state.posts.map((post, i) => (
            <ArticleList key={i} post={post} />
        ));
        const type = this.props.type;
        return (
            <div>
                {data}
                <ul className="pagination">
                    <Paginate
                        count={this.state.total}
                        page={this.state.pageNo[type]}
                        changePage={this.changePage}
                    />
                </ul>
            </div>
        );
    }
}
