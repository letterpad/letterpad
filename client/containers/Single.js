import React, { Component } from "react";
import Article from "../components/post/Article";
import { graphql } from "react-apollo";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import { GET_POST_BY_SLUG, ADJACENT_POSTS } from "../../shared/queries/Queries";
import PropTypes from "prop-types";

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
        if (this.props.post === null) {
            return (
                <OhSnap message="I am not sure how this happened. Maybe this page is dead for good or restricted." />
            );
        }
        const tags = [],
            categories = [];
        this.props.post.taxonomies.forEach(taxonomy => {
            if (taxonomy.type === "post_category") {
                categories.push(taxonomy.name);
            } else {
                tags.push(taxonomy.name);
            }
        });

        return (
            <div>
                <SEO
                    schema="BlogPosting"
                    title={this.props.post.title}
                    description={this.props.post.excerpt}
                    path={"/post/" + this.props.match.params.slug}
                    contentType="article"
                    category={categories.join(",")}
                    tags={tags}
                    image={this.props.post.cover_image}
                    settings={this.props.settings || {}}
                />
                <Article
                    post={this.props.post}
                    adjacentPosts={this.props.adjacentPosts}
                />
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

const adjacentData = graphql(ADJACENT_POSTS, {
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

Single.propTypes = {
    post: PropTypes.object,
    adjacentPosts: PropTypes.object
};
export default adjacentData(ContainerWithPostData(Single));
