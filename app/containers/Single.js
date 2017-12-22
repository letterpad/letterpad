import React, { Component } from "react";
import ArticleEdit from "../components/posts/ArticleEdit";
import { graphql } from "react-apollo";
import PostPublish from "../components/posts/PostPublish";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";
import Excerpt from "../components/posts/Excerpt";
import { GET_SINGLE_POST } from "../../shared/queries/Queries";
import { browserHistory } from "react-router";
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

export default function Single(type) {
    class Single extends Component {
        constructor(props) {
            super(props);
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
                        <div className="col-lg-8 column">
                            <ArticleEdit post={this.props.post} />
                        </div>
                        <div className="col-lg-4 column">
                            <PostPublish post={this.props.post} />
                            <Tags post={this.props.post} />
                            <Categories post={this.props.post} />
                            <Excerpt post={this.props.post} />
                        </div>
                    </div>
                </section>
            );
        }
    }

    const ContainerWithData = graphql(GET_SINGLE_POST, {
        options: props => ({ variables: { id: props.params.post_id } }),
        props: ({ data: { loading, post } }) => ({
            post,
            loading
        })
    });

    return ContainerWithData(Single);
}
