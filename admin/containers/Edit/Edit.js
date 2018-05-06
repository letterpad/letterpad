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
import GetSinglePost from "../../data-connectors/GetSinglePost";
import PostMeta from "../../components/Post/PostMeta";

class Single extends Component {
    constructor(props) {
        super(props);
        this.getHtml = this.getHtml.bind(this);
        this.state = {
            preview: ""
        };
    }
    componentDidMount() {
        document.body.classList.add("edit-post-page", "options-open");
        PostActions.subscribe("update", post => {
            if (post.status == "trash") {
                // this.props.history.push(`/admin/${plural[post.type]}`);
            }
        });
        PostActions.subscribe("change", props => {
            if ("mdPreview" in props) {
                this.setState({ preview: props.mdPreview });
            }
            if ("body" in props) {
                this.setState({ preview: "" });
            }
        });
    }

    componentWillUnmount() {
        document.body.classList.remove("edit-post-page");
    }

    getHtml(html) {
        this.setState({ html });
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
                    <div className="col-lg-12 distractor">
                        <PostPublish edit post={this.props.post} />
                    </div>
                    <div className="col-lg-6 column article-holder ">
                        <ArticleEdit
                            post={this.props.post}
                            setHtml={this.setHtml}
                        />
                        <div className="distractor">
                            <PostMeta post={this.props.post} />
                            <Tags post={this.props.post} />
                            <Categories post={this.props.post} />
                            <Excerpt post={this.props.post} />
                            <FeaturedImage post={this.props.post} />
                        </div>
                    </div>
                    <div className="col-lg-6 column preview distractor">
                        {PostActions.data.mode == "markdown" && (
                            <h2>{PostActions.data.title}</h2>
                        )}
                        <div
                            dangerouslySetInnerHTML={{
                                __html: this.state.preview
                            }}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

Single.propTypes = {
    loading: PropTypes.bool,
    post: PropTypes.object,
    history: PropTypes.object
};

export default GetSinglePost(Single);
