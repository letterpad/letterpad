import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { graphql } from "react-apollo";
import Loader from "../components/Loader";
import { CAT_POSTS } from "../../shared/queries/Queries";
import config from "../../config";
import Paginate from "../components/Paginate";
import OhSnap from "../components/OhSnap";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.page = 1;
        this.state = {
            posts: []
        };
    }

    async loadMore(num) {
        let result = await this.props.fetchMore({
            type: "post_category",
            slug: this.props.slug || this.props.match.params.slug,
            postType: "post",
            limit: config.itemsPerPage,
            offset: num
        });
        this.page = num;
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.posts) {
            return (
                <OhSnap message={this.props.settings.search_notFound.value} />
            );
        }
        if (this.props.posts.length === 0) {
            return (
                <OhSnap message={this.props.settings.text_posts_empty.value} />
            );
        }
        const posts = this.props.posts.map((post, i) => {
            return <ArticleList idx={i} key={i} post={post} />;
        });

        return (
            <Paginate
                data={posts}
                count={this.props.total}
                page={this.page}
                loadMore={this.loadMore}
            />
        );
        //return <div>{posts}</div>;
    }
}

const ContainerWithPostData = graphql(CAT_POSTS, {
    options: props => {
        return {
            variables: {
                type: "post_category",
                slug: props.slug || props.match.params.slug,
                postType: "post",
                limit: config.itemsPerPage,
                offset: 0
            }
        };
    },
    props: ({ data: { loading, postsMenu, fetchMore } }) => {
        return {
            posts: (postsMenu && postsMenu.posts) || [],
            total: (postsMenu && postsMenu.count) || 0,
            loading,
            fetchMore: variables => {
                return fetchMore({
                    variables: variables,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            postsMenu: {
                                count: fetchMoreResult.postsMenu.count,
                                posts: [
                                    ...previousResult.postsMenu.posts,
                                    ...fetchMoreResult.postsMenu.posts
                                ]
                            }
                        };
                    }
                });
            }
        };
    }
});

export default ContainerWithPostData(Posts);
