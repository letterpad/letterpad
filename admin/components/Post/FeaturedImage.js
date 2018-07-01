import React, { Component } from "react";
import PropTypes from "prop-types";

import { uploadFile } from "../../util";
import config from "config";
import UploadCoverImage from "../../data-connectors/UploadCoverImage";
import InsertMedia from "../../data-connectors/InsertMedia";

class FeaturedImage extends Component {
    static contextTypes = {
        t: PropTypes.func
    };
    static propTypes = {
        post: PropTypes.object,
        insertMedia: PropTypes.func.isRequired,
        updateFeaturedImage: PropTypes.func.isRequired,
        toggleFileExplorerModal: PropTypes.func.isRequired
    };
    static defaultProps = {
        post: {
            cover_image: ""
        }
    };

    state = {
        cover_image: this.props.post.cover_image,
        fileExplorerOpen: false
    };

    uploadInputRef = React.createRef();

    uploadImage = async files => {
        const uploadedFiles = await uploadFile({
            files,
            type: "featured_image"
        });
        const coverImage = uploadedFiles[0];
        await this.props.insertMedia({ url: coverImage });
        this.updateFeaturedImage(coverImage);
    };

    updateFeaturedImage = coverImage => {
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: coverImage
        });
        this.setState({ cover_image: coverImage, fileExplorerOpen: false });
        this.props.toggleFileExplorerModal({ display: false });
    };

    toggleFileExplorer = () => {
        this.setState(
            { fileExplorerOpen: !this.state.fileExplorerOpen },
            () => {
                this.props.toggleFileExplorerModal({
                    onClose: this.toggleFileExplorer,
                    onMediaSelect: this.updateFeaturedImage,
                    addNewMedia: () => {
                        this.uploadInputRef.current.click();
                        this.toggleFileExplorer();
                    },
                    display: this.state.fileExplorerOpen
                });
            }
        );
    };

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
                            onClick={() => this.updateFeaturedImage("")}
                        >
                            {t("removeFeaturedImg")}
                        </a>
                    )}
                </div>
                <input
                    ref={this.uploadInputRef}
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

export default UploadCoverImage(InsertMedia(FeaturedImage));
