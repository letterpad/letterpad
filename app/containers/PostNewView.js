import React, { Component, PropTypes } from "react";
import PostActions from "../components/posts/PostActions";
import {
    PostPublish,
    Tags,
    Categories,
    FeaturedImage,
    FileUpload
} from "../components/posts";
import Editor from "../components/posts/Editor";
import config from "../../config/config";
import { gql, graphql } from "react-apollo";

class PostNewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            post: {}
        };
    }
    
    componentDidMount() {
        let that = this;
        this.props.createPost({type:'post'}).then(result => {
            PostActions.setData(result.data.createPost);
            this.setState({ loading: false, post: result.data.createPost });
        });

        PostActions.subscribe(id => {
            that.props.router.push("/admin/post/" + id);
        });
        
        tinyMCE.on(
            "addeditor",
            function(event) {
                var editor = event.editor;
                editor.on("keyup", function() {
                    var c = editor.getContent();
                    PostActions.setData({
                        body: editor.getContent()
                    });
                });
            },
            true
        );
    }

    render() {
        if (this.state.loading) {
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
                                    type="text"
                                    onChange={e => {
                                        PostActions.setData({
                                            title: e.target.value
                                        });
                                    }}
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
                                    onClick={() => {
                                        this.refs.uploadInput.click();
                                    }}
                                >
                                    Insert Media
                                </button>
                                <input
                                    ref="uploadInput"
                                    type="file"
                                    className="hide"
                                    name="uploads[]"
                                    multiple="multiple"
                                />
                                <Editor body="" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-md-3 col-sm-3 col-xs-12">
                    <PostPublish post={this.state.post} />
                    <Tags post={this.state.post} />
                    <Categories post={this.state.post} />
                    <FeaturedImage post={this.state.post} />
                </div>
            </div>
        );
    }
}

PostNewView.propTypes = {
    post: PropTypes.object
};
const createPostQuery = gql`
  mutation createPost($type: String!) {
    createPost(type: $type) {
        id,
        title,
        body,
        author {
            username
        },
        status,
        type,
        excerpt,
        created_at,
        cover_image,
        taxonomies {
            id,
            name,
            type
        }
    }
  }
`;
const createQueryWithData = graphql(createPostQuery, {
    props: ({ mutate }) => ({
        createPost: data => mutate({
            variables: data
        })
    })
});

export default createQueryWithData(PostNewView);
