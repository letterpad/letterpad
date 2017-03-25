import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PostActions from "../../components/posts/PostActions";

class FeaturedImage extends Component {
    constructor(props) {
        super(props);
    }

    uploadImage(files) {
        PostActions.uploadFile(files, "http://localhost:3030/upload")
            .then(cover_image => {
                this.props.updateFeaturedImage({
                    id: this.props.post.id,
                    cover_image: cover_image
                });
            });
    }
    removeImage() {
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: ""
        });
    }

    render() {
        let cover_image = this.props.post.cover_image ||
            "http://placehold.it/800x300";
        return (
            <div className="x_panel">
                <div className="x_content">
                    <div id="featured-image">
                        <img width="100%" src={cover_image} />
                    </div>
                    {(() => {
                        if (!this.props.post.cover_image) {
                            return (
                                <a
                                    className="text-primary pointer"
                                    onClick={() => {
                                        this.refs.uploadInput.click();
                                    }}
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
  mutation uploadFile($cover_image: String!, $id: Int!) {
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
                getPost: (prev, { mutationResult }) => {
                    return {
                        post: {
                            ...prev.post,
                            cover_image: mutationResult.data.uploadFile.cover_image
                        }
                    };
                }
            }
        })
    })
});

export default updateQueryWithData(FeaturedImage);
