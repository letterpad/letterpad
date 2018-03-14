import React, { Component } from "react";
import { graphql } from "react-apollo";
import { plural } from "../../../shared/util";
import PropTypes from "prop-types";
import {
    FeaturedImage,
    ArticleEdit,
    PostPublish,
    PostActions,
    Tags,
    Categories,
    Excerpt
} from "../../components/Post";
import OhSnap from "./OhSnap";
import Loader from "../../components/Loader";
import { GET_SINGLE_POST } from "../../../shared/queries/Queries";

class Single extends Component {
    componentDidMount() {
        document.body.classList.add("edit-post-page");
        PostActions.subscribe(post => {
            if (post.status == "trash") {
                // this.props.history.push(`/admin/${plural[post.type]}`);
            }
        });
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-post-page");
    }
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.post) {
            return (
                <OhSnap message="I am not sure how this happened. Maybe this page is dead for good or restricted." />
            );
        }
        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-lg-8 column article-holder col-lg-offset-2">
                        <ArticleEdit post={this.props.post} />
                    </div>
                    <div className="col-lg-4 column distractor">
                        <PostPublish edit post={this.props.post} />
                        <Tags post={this.props.post} />
                        <Categories post={this.props.post} />
                        <Excerpt post={this.props.post} />
                        <FeaturedImage post={this.props.post} />
                    </div>
                </div>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_SINGLE_POST, {
    options: props => ({ variables: { id: props.match.params.post_id } }),
    props: ({ data: { loading, post } }) => ({
        post,
        loading
    })
});

Single.propTypes = {
    loading: PropTypes.bool,
    post: PropTypes.object,
    history: PropTypes.object
};

export default ContainerWithData(Single);
