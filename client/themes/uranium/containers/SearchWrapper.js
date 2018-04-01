import React, { Component } from "react";
import { graphql } from "react-apollo";
import StackGrid from "react-stack-grid";
import ArticleListItem from "../components/Post/ArticleListItem";
import appoloClient from "../../../apolloClient";
import config from "../../../../config";
import Loader from "../components/Loader";
import { SEARCH_POSTS_BY_TAXONOMY, SEARCH_POSTS } from "shared/queries/Queries";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";

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

        const data =
            this.props.settings.post_display.value == "row" ? (
                <div className="post-row">{posts}</div>
            ) : (
                <div>
                    <StackGrid
                        className="post-grid"
                        columnWidth={"50%"}
                        gutterWidth={12}
                        gutterHeight={12}
                    >
                        {posts}
                    </StackGrid>
                </div>
            );

        if (data.length === 0) {
            return <OhSnap message="wow" />;
        }
        const type = this.props.type;
        return (
            <div>
                <Paginate
                    data={data}
                    count={this.state.total}
                    page={this.state.pageNo[type]}
                    loadMore={this.loadData}
                />
            </div>
        );
    }
}
