import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import About from "../components/sidebar/About";
import Categories from "../components/sidebar/Categories";
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
            </div>
        );
    }
}

const linkedTaxonomies = gql`
  query getTaxonomies($type:String!) {
  postTaxonomies(type:$type) {
    id,
    name,
    type,
    post_count
  }
}
`;

const ContainerWithCatData = graphql(linkedTaxonomies, {
    options: {
        variables: { type: "post_category" }
    },
    props: ({ data: { loading, postTaxonomies } }) => ({
        categories: postTaxonomies,
        loading
    })
});

export default ContainerWithCatData(Sidebar);
