import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { gql, graphql } from "react-apollo";
require("../../public/css/style.scss");

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <div>hello</div>;
        }
        let articles = this.props.posts.map((post, i) => {
            return <ArticleList key={i} post={post} />;
        });
        return (
            <div id="home-container" className="row">
                <div className="col-lg-8">
                    {(() => {
                        if (this.props.loading) {
                            return <div>hello</div>;
                        } else {
                            return articles;
                        }
                    })()}

                </div>
            </div>
        );
    }
}

const allPosts = gql`
  query getPosts {
  posts(type:"post") {
    id,
    title,
    body,
    author {
        username
    },
    status,
    created_at,
    excerpt,
    taxonomies {
      id,
      name,
      type
    }
  }
}
`;

const ContainerWithData = graphql(allPosts, {
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

export default ContainerWithData(Home);
