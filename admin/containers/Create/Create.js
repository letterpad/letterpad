import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { plural } from "../../../shared/util";
import {
    ArticleCreate,
    PostPublish,
    PostActions,
    Tags,
    Categories,
    Excerpt,
    FeaturedImage
} from "../../components/Post";
import CreatePost from "../../data-connectors/CreatePost";
import PostMeta from "../../components/Post/PostMeta";

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            post: {}
        };
    }
    componentWillMount() {
        const { type } = this.props;
        document.body.classList.add("create-" + this.props.type + "-page");
        const title = "Draft - " + moment().format("L LT");
        this.props.createPost({ type, title }).then(result => {
            PostActions.setData(result.data.createPost.post);
            this.setState({
                loading: false,
                post: result.data.createPost.post,
                preview: ""
            });
        });

        PostActions.subscribe("update", post => {
            if (post.status == "trash") {
                this.props.history.push(`/admin/${plural[post.type]}`);
            } else {
                this.props.history.push(
                    `/admin/${plural[post.type]}/${post.id}`
                );
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
        document.body.classList.remove("create-" + this.props.type + "-page");
    }

    render() {
        if (this.state.loading) {
            return <div />;
        }
        return (
            <section className="module-xs create-post">
                <div className="row">
                    <div className="col-lg-12 distractor">
                        <PostPublish create post={this.state.post} />
                    </div>
                    <div className="col-lg-6 column article-holder">
                        <ArticleCreate post={this.state.post} />
                        <div className="distractor">
                            <PostMeta post={this.state.post} />
                            <Tags post={this.state.post} />
                            <Categories post={this.state.post} />
                            <Excerpt post={this.state.post} />
                            <FeaturedImage post={this.props.post} />
                        </div>
                    </div>
                    <div className="col-lg-6 column preview">
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

Create.propTypes = {
    history: PropTypes.object,
    createPost: PropTypes.func,
    type: PropTypes.string
};

export default CreatePost(Create);
