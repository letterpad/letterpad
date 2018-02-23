import React, { Component } from "react";
import Article from "../components/post/Article";
import { gql, graphql } from "react-apollo";
import Loader from "../components/Loader";
import {
    GET_SINGLE_POST,
    GET_POST_BY_SLUG
} from "../../shared/queries/Queries";

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
    render() {
        if (this.props.loading || this.props.adjPostsLoading) {
            return <Loader />;
        }
        return (
            <div>
                {(() => {
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
                })()}
            </div>
        );
    }
}

const ContainerWithPostData = graphql(GET_POST_BY_SLUG, {
    options: props => {
        return {
            variables: {
                type: "post",
                slug: props.match.params.slug
            }
        };
    },
    props: ({ data: { loading, post } }) => ({
        post,
        loading
    })
});

const adjacentPostsQuery = gql`
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
const adjacentData = graphql(adjacentPostsQuery, {
    options: props => {
        return {
            variables: {
                slug: props.match.params.slug
            }
        };
    },
    props: ({ data: { loading, adjacentPosts } }) => ({
        adjacentPosts,
        adjPostsLoading: loading
    })
});
export default adjacentData(ContainerWithPostData(Single));
