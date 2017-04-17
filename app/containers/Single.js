import React, { Component } from "react";
import ArticleEdit from "../components/posts/ArticleEdit";
import { gql, graphql } from "react-apollo";
import PostPublish from "../components/posts/PostPublish";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import Excerpt from "../components/posts/Excerpt";

export default function Single(type) {
    class Single extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            let page = type;
            return (
                <div>
                    {(() => {
                        if (this.props.loading) {
                            return <div>hello</div>;
                        } else {
                            return (
                                <div className={"wrapper " + page}>
                                    <section className="module p-t-20">
                                        <div
                                            className="container-fluid container-custom"
                                        >
                                            <div className="col-lg-8 column">
                                                <ArticleEdit
                                                    post={this.props.post}
                                                />
                                            </div>
                                            <div className="col-lg-4 column">
                                                <PostPublish
                                                    post={this.props.post}
                                                />
                                                <hr />
                                                <Tags post={this.props.post} />
                                                <hr />
                                                <Categories
                                                    post={this.props.post}
                                                />
                                                <hr />
                                                <Excerpt
                                                    post={this.props.post}
                                                />
                                            </div>
                                        </div>
                                    </section>
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
