import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import About from "../components/sidebar/About";
import Categories from "../components/sidebar/Categories";
import LatestPosts from "../components/sidebar/LatestPosts";
import { gql, graphql } from "react-apollo";

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <About />
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

const linkedTaxonomies = gql`
  query getTaxonomies($type:String!,$postType:String) {
  postTaxonomies(type:$type,postType:$postType) {
    id,
    name,
    type,
    post_count
  }
}
`;

const latestPosts = gql`
  query latestPosts($type:String) {
  posts(type:$type, offset: 1, limit: 2) {
    id
    title
    type
    permalink
    created_at
  }
}
`;

const ContainerWithCatData = graphql(linkedTaxonomies, {
    options: {
        variables: { type: "post_category", postType: "post" }
    },
    props: ({ data: { loading, postTaxonomies } }) => ({
        categories: postTaxonomies,
        loading
    })
});

const ContainerWithLatestPosts = graphql(latestPosts, {
    options: {
        variables: { type: "post" }
    },
    props: ({ data: { loading, posts } }) => ({
        posts,
        ploading: loading
    })
});

export default ContainerWithLatestPosts(ContainerWithCatData(Sidebar));
