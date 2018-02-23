import React, { Component } from "react";
import About from "../components/sidebar/About";
import Search from "../components/sidebar/Search";
import Categories from "../components/sidebar/Categories";
import LatestPosts from "../components/sidebar/LatestPosts";
import { graphql } from "react-apollo";
import {
    GET_POSTS_LINKED_TAXONOMIES,
    GET_LATEST_PUBLISHED_POSTS
} from "../../shared/queries/Queries";

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Search history={this.props.history} />
                <About about={this.props.settings.sidebar_about.value} />
                <Categories
                    loading={this.props.loading}
                    categories={this.props.categories}
                />
                <LatestPosts
                    loading={this.props.ploading}
                    posts={this.props.posts}
                />
            </div>
        );
    }
}

const ContainerWithCatData = graphql(GET_POSTS_LINKED_TAXONOMIES, {
    options: {
        variables: { type: "post_category", postType: "post" }
    },
    props: ({ data: { loading, postTaxonomies } }) => ({
        categories: postTaxonomies,
        loading
    })
});

const ContainerWithLatestPosts = graphql(GET_LATEST_PUBLISHED_POSTS, {
    options: props => ({
        variables: {
            type: "post",
            limit: parseInt(props.settings.sidebar_latest_post_count.value)
        }
    }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        ploading: loading
    })
});

export default ContainerWithLatestPosts(ContainerWithCatData(Sidebar));
