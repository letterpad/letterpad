import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { translate } from "react-i18next";

import { uploadFile } from "../../util";
import config from "config";
import UploadCoverImage from "../../data-connectors/UploadCoverImage";
import InsertMedia from "../../data-connectors/InsertMedia";
import PostActions from "./PostActions";

const ImageWrapper = styled.div`
    overflow-x: auto;
    display: flex;
    div {
        width: 100px;
        height: 60px;
        flex-shrink: 0;
        border: 1px solid transparent;
        &:hover {
            opacity: 0.4;
        }
        &.selected {
            opacity: 0.4;
        }
        img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }
`;

class FeaturedImage extends Component {
    static propTypes = {
        post: PropTypes.object,
        insertMedia: PropTypes.func.isRequired,
        updateFeaturedImage: PropTypes.func.isRequired,
        toggleFileExplorerModal: PropTypes.func,
        t: PropTypes.func
    };
    static defaultProps = {
        post: {
            cover_image: ""
        }
    };
    state = {
        cover_image: this.props.post.cover_image,
        fileExplorerOpen: false,
        imageList: []
    };
    uploadInputRef = React.createRef();

    componentDidMount() {
        const imgNodes = document.querySelectorAll(
            ".post-content .editor--content img"
        );
        const imageList = [];
        for (let i = 0; i < imgNodes.length; i++) {
            imageList.push(imgNodes[i].getAttribute("src"));
        }
        this.setState({ imageList });
    }

    selectCoverImage = imagePath => {
        PostActions.setData({ cover_image: imagePath });
        this.setState({ cover_image: imagePath });
    };

    // We are not allowing users to upload any image here.
    // But in future we might allow this. Below are the three methods that will take care of this.
    // Currently they are not being used.
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
        if (this.state.imageList.length === 0) {
            return (
                <div>
                    <div className="meta-label">Cover Image</div>
                    No images found in the current {this.props.post.type}
                </div>
            );
        }

        return (
            <div>
                <div className="meta-label">Cover Image</div>
                <ImageWrapper className="images-wrapper">
                    {this.state.imageList.map((imagePath, idx) => {
                        const selected = imagePath === this.state.cover_image;
                        return (
                            <div
                                key={idx}
                                className={selected ? "selected" : ""}
                                onClick={() => this.selectCoverImage(imagePath)}
                            >
                                <img
                                    alt=""
                                    width="100%"
                                    src={config.baseName + imagePath}
                                />
                            </div>
                        );
                    })}
                </ImageWrapper>
            </div>
        );
    }
}

export default translate("translations")(
    UploadCoverImage(InsertMedia(FeaturedImage))
);
