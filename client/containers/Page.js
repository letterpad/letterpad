import React, { Component } from "react";
import Article from "../components/post/Article";
import { graphql } from "react-apollo";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import { PAGE_MENU } from "../../shared/queries/Queries";

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
        const post = this.props.page.post;
        const tags = [],
            categories = [];
        post.taxonomies.forEach(taxonomy => {
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
                    title={post.title}
                    description={post.excerpt}
                    path={"/post/" + this.props.match.params.slug}
                    contentType="article"
                    category={categories.join(",")}
                    tags={tags}
                    image={post.cover_image}
                    settings={this.props.settings || {}}
                />
                <Article post={post} />;
            </div>
        );
    }
}

const ContainerWithPageData = graphql(PAGE_MENU, {
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
