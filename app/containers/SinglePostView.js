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
    FileUpload
} from "../components/posts";
import Editor from "../components/posts/Editor";
import config from "../../config/config";
import { gql, graphql } from "react-apollo";

class SinglePostView extends Component {
    static prefetchData = [params => ActionCreators.getPost(params.post_id)];

    constructor(props) {
        super(props);
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
                                    defaultValue={this.props.posts[0].title}
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
                                        this
                                    )}
                                >
                                    Insert Media
                                </button>
                                <input
                                    ref="uploadInput"
                                    onChange={PostActions.insertImageInPost.bind(
                                        this
                                    )}
                                    type="file"
                                    className="hide"
                                    name="uploads[]"
                                    multiple="multiple"
                                />
                                <Editor body={this.props.posts[0].body} />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-md-3 col-sm-3 col-xs-12">
                    <PostPublish
                        post={this.props.posts[0]}
                        updatePost={PostActions.updatePost.bind(this)}
                    />
                    <Tags
                        post={this.props.posts[0]}
                        setData={PostActions.setTaxonomies.bind(this)}
                    />
                    <Categories
                        post={this.props.posts[0]}
                        setData={PostActions.setTaxonomies.bind(this)}
                    />
                    <FeaturedImage
                        post={this.props.posts[0]}
                        removeFeaturedImage={PostActions.removeFeaturedImage.bind(
                            this
                        )}
                    />
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
            updatePost: ActionCreators.updatePost,
            uploadCoverImage: ActionCreators.uploadCoverImage,
            removeFeaturedImage: ActionCreators.removeFeaturedImage,
            uploadFiles: ActionCreators.uploadFiles
        },
        dispatch
    );
};
const postQuery = gql`
  query getPosts($id: String!) {
  posts(id:$id) {
    id,
    title,
    body,
    author {
        username
    },
    status,
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

const ContainerWithData = graphql(postQuery, {
    options: (props) => ({ variables: { id: props.params.post_id } }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

const updatePostQuery = gql`
  mutation updatePost($id: String!, $title: String!, $body: String!, $status: String!, $excerpt: String!, $taxonomies: [TaxonomyInputType]) {
    updatePost(id: $id, title: $title, body: $body, status: $status, excerpt: $excerpt, taxonomies: $taxonomies) {
      id
    }
  }
`;
const updateQueryWithData = graphql(updatePostQuery, {
    props: ({ mutate }) => ({
        update: data => mutate({ variables: data })
    })
});

export default updateQueryWithData(ContainerWithData(SinglePostView));
