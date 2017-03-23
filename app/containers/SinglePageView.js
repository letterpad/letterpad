import React, { Component } from "react";
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

class SinglePageView extends Component {
    static prefetchData = [params => ActionCreators.getPost(params.post_id)];

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        tinyMCE &&
            tinyMCE.on(
                "addeditor",
                function(event) {
                    var editor = event.editor;
                    editor.on("keyup", function() {
                        PostActions.setData({
                            body: editor.getContent()
                        });
                    });
                },
                true
            );
    }

    render() {
        if (this.props.loading) {
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
                                    defaultValue={this.props.page.title}
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
                                <Editor body={this.props.page.body} />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-md-3 col-sm-3 col-xs-12">
                    <PostPublish post={this.props.page} />
                    <Tags post={this.props.page} />
                    <Categories post={this.props.page} />
                    <FeaturedImage post={this.props.page} />
                </div>
            </div>
        );
    }
}

const postQuery = gql`
  query getPost($id: Int!) {
  post(id:$id) {
    id,
    title,
    body,
    author {
        username
    },
    status,
    created_at,
    cover_image,
    excerpt,
    taxonomies {
      id,
      name,
      type
    }
  }
}
`;

const ContainerWithData = graphql(postQuery, {
    options: props => ({ variables: { id: props.params.page_id } }),
    props: ({ data: { loading, post } }) => ({
        page: post,
        loading
    })
});

export default ContainerWithData(SinglePageView);
