import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import { PostActions, Tags, Categories, FeaturedImage } from "../components/posts";
import config from "../../config/config";

class PostNewView extends Component {
    constructor(props) {
        super(props);
        this.editorLoaded = false;
    }

    componentDidMount() {
        this.props.insertEmptyPost();

        if (!this.editorLoaded) {
            this.loadEditor();
        }
    }
    componentWillUnmount() {
        this.editorLoaded = false;
    }

    componentDidUpdate() {
        if (!this.editorLoaded) {
            this.loadEditor();
        }
    }

    loadEditor() {
        if (!this.editorLoaded) {
            tinymce.init({
                selector: "textarea.editor",
                height: 300,
                menubar: false,
                theme: "modern",
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "template paste textcolor colorpicker textpattern imagetools codesample"
                ],
                toolbar1: "undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                toolbar2: "print preview media | forecolor backcolor emoticons | codesample",
                image_advtab: true,
                templates: [
                    { title: "Test template 1", content: "Test 1" },
                    { title: "Test template 2", content: "Test 2" }
                ],
                init_instance_callback: () => {
                    this.editorLoaded = true;
                }
            });
        }
    }

    render() {
        return (
            <div>

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
                                        type="text"
                                        value={this.props.post.data.title}
                                        id="post-title"
                                        name="post-title"
                                        required="required"
                                        className="form-control"
                                        placeholder="Enter the title here"
                                    />
                                </div>
                                <div className="form-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-toggle="lean-modal"
                                        data-target="#modal-insert-media"
                                    >
                                        Insert Media
                                    </button>
                                    <textarea className="editor" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <PostActions post={this.props.post} />
                        <Tags post={this.props.post} />
                        <Categories post={this.props.post} />
                        <FeaturedImage post={this.props.post} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        post: state.posts.post
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            insertEmptyPost: ActionCreators.insertEmptyPost
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PostNewView);