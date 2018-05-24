import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { plural } from "../../../shared/util";
import {
    ArticleCreate,
    PostPublish,
    PostActions,
    PostActionDrawer
} from "../../components/Post";
import CreatePost from "../../data-connectors/CreatePost";
import PostMeta from "../../components/Post/PostMeta";
import FileExplorerModal from "../../components/Modals/FileExplorerModal";

class Create extends Component {
    constructor(props) {
        super(props);
        this.handlePostChanges = this.handlePostChanges.bind(this);
        this.state = {
            loading: true,
            post: {}
        };
    }

    componentDidMount() {
        document.body.classList.add("create-" + this.props.type + "-page");
    }

    componentWillMount() {
        const { type } = this.props;
        window.addEventListener("onPostChange", this.handlePostChanges);
        window.addEventListener("onPostSave", this.handlePostSave);

        const title = "Draft - " + moment().format("L LT");
        this.props.createPost({ type, title }).then(result => {
            PostActions.setData(result.data.createPost.post);
            this.setState({
                loading: false,
                post: result.data.createPost.post,
                preview: ""
            });
        });
    }

    componentWillUnmount() {
        document.body.classList.remove("create-" + this.props.type + "-page");
        window.removeEventListener("onPostChange", this.handlePostChanges);
        window.removeEventListener("onPostSave", this.handlePostSave);
    }

    handlePostChanges(e) {
        if (this.state.post.mode == "markdown") {
            //this.addScrollTimer();
            if ("mdPreview" in e.detail) {
                this.setState({ preview: e.detail.mdPreview });
            }
        } else if ("body" in e.detail) {
            this.setState({
                preview: "Preview is only available for markdown editor"
            });
        }
    }

    handlePostSave(e) {
        const post = e.detail;
        if (post.status == "trash") {
            this.props.history.push(`/admin/${plural[post.type]}`);
        } else {
            this.props.history.push(`/admin/${plural[post.type]}/${post.id}`);
        }
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
                <PostActionDrawer
                    post={this.props.post}
                    isOpen={this.state.actionDrawerOpen}
                    toggleActionDrawer={this.toggleActionDrawer}
                    toggleFileExplorerModal={this.toggleFileExplorerModal}
                />
                {this.state.fileExplorerProps.display && (
                    <FileExplorerModal {...this.state.fileExplorerProps} />
                )}
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
