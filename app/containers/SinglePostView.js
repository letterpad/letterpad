import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../redux/actions/ActionCreators";
import { PostActions, Tags, Categories, FeaturedImage } from "../components/posts";
import config from "../../config/config";

class SinglePostView extends Component {
    static prefetchData = [params => ActionCreators.getPost(params.post_id)];

    constructor(props) {
        super(props);
        this.editorLoaded = false;
        this.updatePost = this.updatePost.bind(this);
        this.setData = this.setData.bind(this);

    }

    componentDidMount() {
        this.props.getPost(this.props.params.post_id);
        this.props.getTaxonomyList();

        if (!this.editorLoaded) {
            this.loadEditor();
        }
    }
    componentWillUnmount() {
        this.editorLoaded = false;
    }
    componentWillReceiveProps(nextState) {
        this.childData = {
            post_tag: nextState.post.data.post_tags || [],
            post_category: nextState.post.data.post_categories || []
        };

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
                    tinymce.activeEditor.setContent(this.props.post.data.body);
                }
            });
        }
    }
    setData(data) {
        this.childData = {
            ...this.childData,
            ...data
        };
    }

    updatePost(data) {
        let newData = {
            ...this.props.post.data,
            taxonomies: {
                ...this.childData
            },
            status: data.status,
            title: this.titleInput.value,
            body: tinyMCE.activeEditor.getContent(),
            excerpt: "",
            cover_image: ""
        };

        this.props.updatePost(newData);
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
                    <PostActions post={this.props.post} updatePost={this.updatePost} />
                    <Tags post={this.props.post} setData={this.setData} />
                    <Categories post={this.props.post} setData={this.setData} />
                    <FeaturedImage post={this.props.post} setData={this.setData} />
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
            getPost: ActionCreators.getPost,
            getTaxonomyList: ActionCreators.getTaxonomyList,
            updatePost: ActionCreators.updatePost
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePostView);