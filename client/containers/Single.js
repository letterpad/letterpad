import React, { Component } from "react";
import Article from "../components/post/Article";
import { gql, graphql } from "react-apollo";
import Loader from "../components/Loader";

const OhSnap = ({ message }) => {
    return (
        <section className="module-xs">
            <div className="row">
                <div className="card">
                    <div className="module-title">Oh Snap!</div>
                    <div className="module-subtitle">{message}</div>
                </div>
            </div>
        </section>
    );
};

class Single extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {(() => {
                    if (this.props.loading || this.props.adjPostsLoading) {
                        return <Loader />;
                    } else {
                        if (this.props.post === null) {
                            return (
                                <OhSnap message="I am not sure how this happened. Maybe this page is dead for good or restricted." />
                            );
                        }
                        return (
                            <Article
                                post={this.props.post}
                                adjacentPosts={this.props.adjacentPosts}
                            />
                        );
                    }
                })()}
            </div>
        );
    }
}

const singlePost = gql`
    query singlePost($type: String, $slug: String) {
        post(type: $type, slug: $slug) {
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
const ContainerWithPostData = graphql(singlePost, {
    options: props => {
        return {
            variables: {
                type: "post",
                slug: props.params.slug
            }
        };
    },
    props: ({ data: { loading, post } }) => ({
        post,
        loading
    })
});

const adjacentPosts = gql`
    query adjacentPosts($slug: String) {
        adjacentPosts(type: "post", slug: $slug) {
            next {
                title
                slug
            }
            previous {
                title
                slug
            }
        }
    }
`;
const adjacentPostsData = graphql(adjacentPosts, {
    options: props => {
        return {
            variables: {
                slug: props.params.slug
            }
        };
    },
    props: ({ data: { loading, adjacentPosts } }) => ({
        adjacentPosts: adjacentPosts,
        adjPostsLoading: loading
    })
});
export default adjacentPostsData(ContainerWithPostData(Single));
