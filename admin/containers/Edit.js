import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import ArticleEdit from "../components/posts/ArticleEdit";
import PostPublish from "../components/posts/PostPublish";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import Excerpt from "../components/posts/Excerpt";
import { GET_SINGLE_POST } from "../../shared/queries/Queries";
import Loader from "../components/Loader";
import PostActions from "../components/posts/PostActions";
import { plural } from "../../shared/util";

const OhSnap = ({ message }) => (
    <section className="module-xs">
        <div className="row">
            <div className="card">
                <div className="module-title">Oh Snap!</div>
                <div className="module-subtitle">{message}</div>
            </div>
        </div>
    </section>
);

OhSnap.propTypes = {
    message: PropTypes.string
};

class Single extends Component {
    componentDidMount() {
        PostActions.subscribe(post => {
            if (post.status == "trash") {
                this.props.history.push(`/admin/${plural[post.type]}`);
            }
        });
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
            <div className="row">
                <div className="col-lg-8 column">
                    <ArticleEdit post={this.props.post} />
                </div>
                <div className="col-lg-4 column">
                    <PostPublish edit post={this.props.post} />
                    <br />
                    <Tags post={this.props.post} />
                    <br />
                    <Categories post={this.props.post} />
                    <br />
                    <Excerpt post={this.props.post} />
                </div>
            </div>
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
    post: PropTypes.object
};

export default ContainerWithData(Single);
