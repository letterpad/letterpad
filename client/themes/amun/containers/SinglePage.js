import React, { Component } from "react";
import Article from "../components/Post/Article";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import OhSnap from "../components/OhSnap";
import SinglePageData from "shared/data-connectors/SinglePageData";
import moment from "moment";

class SinglePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.loading && !nextProps.loading) {
            this.setState({ loading: false });
            this.props.setHeroDetails({
                image: nextProps.page.cover_image,
                title: nextProps.page.title,
                subTitle: moment(new Date(nextProps.page.created_at)).format(
                    "LL"
                )
            });
        }
    }
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.page.ok) {
            return (
                <OhSnap message="Sorry, this page does not exist or might be restricted." />
            );
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
                <Article post={post} />
            </div>
        );
    }
}

export default SinglePageData(SinglePage);
