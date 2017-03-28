import React, { Component } from "react";
import ArticleEdit from "../components/posts/ArticleEdit";
import { gql, graphql } from "react-apollo";
import PostPublish from "../components/posts/PostPublish";

export default function Single(type) {
    class Single extends Component {
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
                            return (
                                <div>
                                    <PostPublish post={this.props.post} />
                                    <ArticleEdit post={this.props.post} />
                                </div>
                            );
                        }
                    })()}
                </div>
            );
        }
    }

    const postQuery = gql`
  query getPost($id: Int!) {
  post(id:$id) {
    id,
    title,
    body,
    author {
        username
    },
    status,
    created_at,
    cover_image,
    excerpt,
    taxonomies {
      id,
      name,
      type
    }
  }
}
`;

    const ContainerWithData = graphql(postQuery, {
        options: props => ({ variables: { id: props.params.post_id } }),
        props: ({ data: { loading, post } }) => ({
            post,
            loading
        })
    });

    return ContainerWithData(Single);
}
