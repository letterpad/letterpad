import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { gql, graphql } from "react-apollo";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {(() => {
                    if (this.props.loading) {
                        return <div>hello</div>;
                    } else {
                        return this.props.posts.map((post, i) => {
                            return <ArticleList key={i} post={post} />;
                        });
                    }
                })()}
            </div>
        );
    }
}

const allPosts = gql`
  query getPosts {
  posts(type:"post") {
    edges {
        node {
            id,
            title,
            body,
            status,
            created_at,
            excerpt,
            cover_image,
            taxonomies {
                id,
                name,
                type
            }
        }
    }
  }
}
`;
const ContainerWithPostData = graphql(allPosts, {
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

export default ContainerWithPostData(Home);
