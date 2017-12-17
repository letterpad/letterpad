import React, { Component } from "react";
import Article from "../components/post/Article";
import { gql, graphql } from "react-apollo";

class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <div>hello</div>;
        }
        if (this.props.post === null) {
            return <div>Nothing found..Absolute bullshit</div>;
        }
        return (
            <div>
                <Article post={this.props.page} />;
            </div>
        );
    }
}

const pageQuery = gql`
    query pageMenu($name: String, $postType: String) {
        pageMenu(name: $name, postType: $postType) {
            id
            title
            body
            status
            created_at
            excerpt
            cover_image
            taxonomies {
                id
                name
                type
            }
        }
    }
`;
const ContainerWithPageData = graphql(pageQuery, {
    options: props => {
        return {
            variables: {
                name: props.params.slug,
                postType: "page"
            }
        };
    },
    props: ({ data: { loading, pageMenu } }) => ({
        page: pageMenu,
        loading
    })
});

export default ContainerWithPageData(Page);
