import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import * as PostActions from "../components/posts/PostActions";
import {
    PostPublish,
    Tags,
    Categories,
    FeaturedImage,
    FileUpload,
} from "../components/posts";
import Editor from "../components/posts/Editor";
import config from "../../config/config";

class PostNewView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.insertEmptyPost();
        this.props.getTaxonomyList();
    }

    componentWillReceiveProps(nextState) {
        this.childData = {
            post_tag: nextState.post.data.post_tags || [],
            post_category: nextState.post.data.post_categories || [],
        };
    }
    render() {
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
                                    value={this.props.post.data.title}
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
                                    onClick={PostActions.openUploadWindow.bind(
                                        this,
                                    )}
                                >
                                    Insert Media
                                </button>
                                <input
                                    ref="uploadInput"
                                    onChange={PostActions.insertImageInPost.bind(
                                        this,
                                    )}
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
                    <PostPublish
                        post={this.props.post}
                        updatePost={PostActions.updatePost.bind(this)}
                    />
                    <Tags
                        post={this.props.post}
                        setData={PostActions.setTaxonomies.bind(this)}
                    />
                    <Categories
                        post={this.props.post}
                        setData={PostActions.setTaxonomies.bind(this)}
                    />
                    <FeaturedImage
                        post={this.props.post}
                        removeFeaturedImage={PostActions.removeFeaturedImage.bind(
                            this,
                        )}
                        insertFeaturedImage={PostActions.insertFeaturedImage.bind(
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
            insertEmptyPost: ActionCreators.insertEmptyPost,
            getTaxonomyList: ActionCreators.getTaxonomyList,
            updatePost: ActionCreators.updatePost,
            uploadCoverImage: ActionCreators.uploadCoverImage,
            removeFeaturedImage: ActionCreators.removeFeaturedImage,
            uploadFiles: ActionCreators.uploadFiles,
        },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNewView);
