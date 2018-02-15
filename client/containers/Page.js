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

class Page extends Component {
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.page.ok) {
            return <OhSnap message="Something wrong happened" />;
        }
        return (
            <div>
                <Article post={this.props.page.post} />;
            </div>
        );
    }
}

const pageQuery = gql`
    query pageMenu($slug: String, $postType: String) {
        pageMenu(slug: $slug, postType: $postType) {
            ok
            post {
                id
                title
                body
                status
                created_at
                excerpt
                cover_image
                slug
                taxonomies {
                    id
                    name
                    type
                }
            }
            errors {
                message
            }
        }
    }
`;
const ContainerWithPageData = graphql(pageQuery, {
    options: props => {
        return {
            variables: {
                slug: props.slug || props.match.params.slug,
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
