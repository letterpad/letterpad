import React, { Component } from "react";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";

class PostPublish extends Component {
    updatePost(e, status) {
        e.preventDefault();
        PostActions.setData(status);
        let data = PostActions.getData();
        return this.props
            .update({
                ...this.props.post,
                ...data
            })
            .then(result => {
                PostActions.postUpdated(result.data.updatePost.id);
            });
    }

    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Publish</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <h5 className="buffer-bottom">
                        Status: {this.props.post.status}
                    </h5>

                    <button
                        id="post-btn-publish"
                        name="btn-publish"
                        type="submit"
                        onClick={e => this.updatePost(e, { status: "publish" })}
                        className="btn btn-sm btn-primary col-xs-12"
                    >
                        Publish
                    </button>
                    <br className="clear" />
                    <div className="divider-dashed" />
                    <button
                        id="post-btn-preview"
                        name="btn-preview"
                        type="submit"
                        className="btn btn-sm btn-default pull-left"
                    >
                        Preview
                    </button>
                    <button
                        id="post-btn-draft"
                        name="btn-draft"
                        type="submit"
                        onClick={e => this.updatePost(e, { status: "draft" })}
                        className="btn btn-sm btn-default pull-right"
                    >
                        Save Draft
                    </button>
                    <br className="clear" />
                    <div className="divider-dashed" />
                    <a
                        href="#"
                        onClick={e => this.updatePost(e, { status: "deleted" })}
                        name="btn-trash"
                        type="submit"
                        className="text-danger text-bold"
                    >
                        Move to Trash
                    </a>

                </div>
            </div>
        );
    }
}

const updatePostQuery = gql`
  mutation updatePost($id: String!, $title: String!, $body: String!, $status: String!, $excerpt: String!, $taxonomies: [TaxonomyInputType]) {
    updatePost(id: $id, title: $title, body: $body, status: $status, excerpt: $excerpt, taxonomies: $taxonomies) {
        id,
        title,
        body,
        author {
            username
        },
        type,
        status,
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
const updateQueryWithData = graphql(updatePostQuery, {
    props: ({ mutate }) => ({
        update: data => mutate({
            variables: data,
            updateQueries: {
                getPost: (prev, { mutationResult }) => {
                    debugger;
                    return {
                            post: {
                                ...prev.post,
                                ...mutationResult.data.updatePost
                            }
                        };
                }
            }
        })
    })
});
export default updateQueryWithData(PostPublish);
