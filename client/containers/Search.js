import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { gql, graphql } from "react-apollo";

export default function Search(term) {
    class Search extends Component {
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
  query getPosts($type:String!,$query:String!) {
  posts(type:$type,body:$query) {
    id,
    title,
    body,
    author {
        username
    },
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
`;

    if (term == "post") {
        const ContainerWithData = graphql(allPosts, {
            options: props => {
                return {
                    variables: {
                        type: "post",
                        query: '{ "like": "%' + props.params.query + '%" }'
                    }
                };
            },
            props: ({ data: { loading, posts } }) => ({
                posts,
                loading
            })
        });
        return ContainerWithData(Search);
    } else if (term == "category") {
        const ContainerWithData = graphql(allPosts, {
            options: props => {
                return {
                    variables: {
                        type: "post",
                        query: undefined
                    }
                };
            },
            props: ({ data: { loading, posts } }) => ({
                posts,
                loading
            })
        });
    } else if (term == "tag") {
    }
    return Search;
}
