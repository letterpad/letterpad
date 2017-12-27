import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import PostActions from "../../components/posts/PostActions";

class FeaturedImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cover_image: this.props.post.cover_image
        };
        this.removeImage = this.removeImage.bind(this);
    }

    async uploadImage(files) {
        const coverImage = await PostActions.uploadFile(
            files,
            this.props.insertMedia
        );

        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: coverImage
        });
        this.setState({ cover_image: coverImage });
    }
    removeImage() {
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: ""
        });
        this.setState({ cover_image: "" });
    }

    render() {
        const coverImage =
            this.state.cover_image || "http://placehold.it/800x300";
        return (
            <div className="x_panel">
                <div className="x_content">
                    <div id="featured-image">
                        <img alt="" width="100%" src={coverImage} />
                    </div>
                    {(() => {
                        if (!this.state.cover_image) {
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
                        }
                        return (
                            <a
                                className="text-primary pointer"
                                onClick={this.removeImage}
                            >
                                Remove Featured Image
                            </a>
                        );
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
            id
            cover_image
        }
    }
`;

const updateQueryWithData = graphql(uploadCoverImageQuery, {
    props: ({ mutate }) => ({
        updateFeaturedImage: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        const coverImage = mutationResult.data.uploadFile
                            ? mutationResult.data.uploadFile.cover_image
                            : "";
                        return {
                            post: {
                                ...prev.post,
                                cover_image: coverImage
                            }
                        };
                    }
                }
            })
    })
});

const insertMediaQuery = gql`
    mutation insertMedia($url: String!) {
        insertMedia(url: $url) {
            url
        }
    }
`;
const insertMedia = graphql(insertMediaQuery, {
    props: ({ mutate }) => ({
        insertMedia: data => {
            mutate({
                variables: data
            });
        }
    })
});

const Data = compose(updateQueryWithData, insertMedia);
export default Data(FeaturedImage);
