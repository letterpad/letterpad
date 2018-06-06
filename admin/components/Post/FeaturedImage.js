import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";
import PostActions from "./PostActions";
import {
    INSERT_MEDIA,
    UPLOAD_COVER_IMAGE
} from "../../../shared/queries/Mutations";
import FileExplorerModal from "../Modals/FileExplorerModal";
import { uploadFile } from "../../util";
import config from "config";

class FeaturedImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cover_image: this.props.post.cover_image,
            fileExplorerOpen: false
        };
        this.updateFeaturedImage = this.updateFeaturedImage.bind(this);
        this.toggleFileExplorer = this.toggleFileExplorer.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    async uploadImage(files) {
        const coverImage = await uploadFile({ files, type: "post_image" });
        await this.props.insertMedia({ url: coverImage });
        this.updateFeaturedImage(coverImage);
    }

    updateFeaturedImage(coverImage) {
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: coverImage
        });
        this.setState({ cover_image: coverImage, fileExplorerOpen: false });
        this.props.toggleFileExplorerModal({ display: false });
    }

    toggleFileExplorer() {
        this.setState(
            { fileExplorerOpen: !this.state.fileExplorerOpen },
            () => {
                this.props.toggleFileExplorerModal({
                    onClose: this.toggleFileExplorer,
                    onMediaSelect: this.updateFeaturedImage,
                    addNewMedia: () => {
                        this.refs.uploadInput.click();
                        this.toggleFileExplorer();
                    },
                    display: this.state.fileExplorerOpen
                });
            }
        );
    }

    render() {
        const { t } = this.context;

        const coverImage =
            this.state.cover_image || "/admin/images/placeholder-800x400.png";

        return (
            <div className="card">
                <div className="module-title">Cover Image</div>
                <div className="featured-image">
                    <img
                        alt=""
                        width="100%"
                        src={config.baseName + coverImage}
                    />
                    {!this.state.cover_image ? (
                        <a
                            className="btn btn-xs btn-dark"
                            onClick={this.toggleFileExplorer}
                        >
                            {t("addFeaturedImg")}
                        </a>
                    ) : (
                        <a
                            className="btn btn-xs btn-dark"
                            onClick={_ => this.updateFeaturedImage("")}
                        >
                            {t("removeFeaturedImg")}
                        </a>
                    )}
                </div>
                <input
                    ref="uploadInput"
                    onChange={input => this.uploadImage(input.target.files)}
                    type="file"
                    className="hide"
                    name="uploads[]"
                    multiple="multiple"
                />
            </div>
        );
    }
}

const updateQueryWithData = graphql(UPLOAD_COVER_IMAGE, {
    props: ({ mutate }) => ({
        updateFeaturedImage: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        const coverImage = mutationResult.data.uploadFile
                            ? mutationResult.data.uploadFile.post.cover_image
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

const insertMedia = graphql(INSERT_MEDIA, {
    props: ({ mutate }) => ({
        insertMedia: data => {
            mutate({
                variables: data
            });
        }
    })
});

FeaturedImage.contextTypes = {
    t: PropTypes.func
};

FeaturedImage.defaultProps = {
    post: {
        cover_image: ""
    }
};
const Data = compose(updateQueryWithData, insertMedia);
export default Data(FeaturedImage);
