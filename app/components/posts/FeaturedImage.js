import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import * as PostActions from "../../components/posts/PostActions";

class FeaturedImage extends Component {
    constructor(props) {
        super(props);
        this.props.uploadInput;
    }

    openUploadWindow() {
        this.refs.uploadInput.click();
    }
    uploadImage(files) {
        PostActions.uploadFile(files).then(cover_image => {
            this.props.updateFeaturedImage({
                id: this.props.post.id,
                cover_image: cover_image
            });
        });
    }
    removeImage() {
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: ''
        });
    }

    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Set Featured Image</h2>
                    <div className="clearfix" />
                </div>
                <div className="x_content">
                    <div id="featured-image">
                        {this.props.post.cover_image &&
                            <img
                                width="100%"
                                src={this.props.post.cover_image}
                            />}
                    </div>
                    {(() => {
                        if (!this.props.post.cover_image) {
                            return (
                                <a
                                    className="text-primary pointer"
                                    onClick={this.openUploadWindow.bind(this)}
                                >
                                    Set Featured Image
                                </a>
                            );
                        } else {
                            return (
                                <a
                                    className="text-primary pointer"
                                    onClick={this.removeImage.bind(this)}
                                >
                                    Remove Featured Image
                                </a>
                            );
                        }
                    })()}
                    <input
                        ref="uploadInput"
                        onChange={input => this.uploadImage(input.target.files)}
                        type="file"
                        className="hide"
                        name="uploads[]"
                        multiple="multiple"
                    />
                </div>
            </div>
        );
    }
}

const uploadCoverImageQuery = gql`
  mutation uploadFile($cover_image: String!, $id: String!) {
    uploadFile(cover_image: $cover_image, id: $id) {
      id,
      cover_image
    }
  }
`;

const updateQueryWithData = graphql(uploadCoverImageQuery, {
    props: ({ mutate }) => ({
        updateFeaturedImage: data => mutate({
            variables: data,
            updateQueries: {
                getPosts: (prev, { mutationResult }) => {
                    return {
                        posts: [
                            {
                                ...prev.posts[0],
                                cover_image: mutationResult.data.uploadFile.cover_image
                            }
                        ]
                    };
                }
            }
        })
    })
});

export default updateQueryWithData(FeaturedImage);
