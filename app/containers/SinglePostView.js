import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import {
    PostActions,
    Tags,
    Categories,
    FeaturedImage,
    FileUpload,
} from "../components/posts";
import Editor from "../components/posts/Editor";
import config from "../../config/config";

class SinglePostView extends Component {
    static prefetchData = [params => ActionCreators.getPost(params.post_id)];

    constructor(props) {
        super(props);
        this.editorLoaded = false;
        this.updatePost = this.updatePost.bind(this);
        this.setTaxonomies = this.setTaxonomies.bind(this);
    }

    componentDidMount() {
        this.props.getPost(this.props.params.post_id);
        this.props.getTaxonomyList();
    }

    componentWillReceiveProps(nextState) {
        this.childData = {
            post_tag: nextState.post.data.post_tags || [],
            post_category: nextState.post.data.post_categories || [],
        };
    }

    setTaxonomies(data) {
        this.childData = {
            ...this.childData,
            ...data,
        };
    }

    insertFeaturedImage(files) {
        this.props.uploadCoverImage(files, this.props.post.data.id);
    }

    removeFeaturedImage() {
        this.props.removeFeaturedImage(this.props.post.data.id);
    }

    insertImageInPost() {
        var files = this.refs.uploadInput.files;

        if (files.length > 0) {
            this.props.uploadFiles(files, this.props.post.data.id, response => {
                var ed = tinyMCE.activeEditor; // get editor instance
                var range = ed.selection.getRng(); // get range
                var newNode = ed.getDoc().createElement("img"); // create img node
                newNode.src = response; // add src attribute
                range.insertNode(newNode);
            });
        }
    }

    updatePost(data) {
        let newData = {
            ...this.props.post.data,
            taxonomies: {
                ...this.childData,
            },
            status: data.status,
            title: this.titleInput.value,
            body: tinyMCE.activeEditor.getContent(),
            excerpt: "",
        };

        this.props.updatePost(newData);
    }
    openUploadWindow() {
        this.refs.uploadInput.click();
    }

    render() {
        if (this.props.post.loading) {
            return (
                <div>
                    <div className="row row-offcanvas row-offcanvas-left">
                        <div className="col-xs-12 col-sm-8">
                            <img src="/images/loading.svg" />
                        </div>
                    </div>
                </div>
            );
        }
        let url = config.clientUrl + "/post/" + this.props.post.data.id;
        return (
            <div>
                <div className="col-md-9 col-sm-9 col-xs-12">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>Title</h2>
                            <div className="clearfix" />
                        </div>
                        <div className="x_content">

                            <div className="form-group">
                                <input
                                    defaultValue={this.props.post.data.title}
                                    type="text"
                                    ref={input => this.titleInput = input}
                                    name="post-title"
                                    required="required"
                                    className="form-control"
                                    placeholder="Enter the title here"
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={this.openUploadWindow.bind(this)}
                                >
                                    Insert Media
                                </button>
                                <input
                                    ref="uploadInput"
                                    onChange={this.insertImageInPost.bind(this)}
                                    type="file"
                                    className="hide"
                                    name="uploads[]"
                                    multiple="multiple"
                                />
                                <Editor body={this.props.post.data.body} />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-md-3 col-sm-3 col-xs-12">
                    <PostActions
                        post={this.props.post}
                        updatePost={this.updatePost}
                    />
                    <Tags post={this.props.post} setData={this.setTaxonomies} />
                    <Categories
                        post={this.props.post}
                        setData={this.setTaxonomies}
                    />
                    <FeaturedImage
                        post={this.props.post}
                        removeFeaturedImage={this.removeFeaturedImage.bind(
                            this,
                        )}
                        insertFeaturedImage={this.insertFeaturedImage.bind(
                            this,
                        )}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        post: state.posts.post,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            getPost: ActionCreators.getPost,
            getTaxonomyList: ActionCreators.getTaxonomyList,
            updatePost: ActionCreators.updatePost,
            uploadCoverImage: ActionCreators.uploadCoverImage,
            removeFeaturedImage: ActionCreators.removeFeaturedImage,
            uploadFiles: ActionCreators.uploadFiles,
        },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePostView);
