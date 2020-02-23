import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

import FileExplorerModal from "../modals/FileExplorerModal";
import { Post } from "../../../__generated__/gqlTypes";
import PostActions from "./PostActions";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import styled from "styled-components";
import { uploadFile } from "../../server/util";

const ImageWrapper = styled.div`
  overflow-x: auto;
  display: flex;
  div {
    width: 100px;
    height: 60px;
    flex-shrink: 0;
    border: 1px solid transparent;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
    &.selected {
      opacity: 1;
    }
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .custom-featured-image span {
    position: absolute;
    width: 98px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    opacity: 0.6;
    color: #fff;
    font-size: 50px;
  }
`;

const CustomImage = ({
  removeCustomImage,
  toggleFileExplorer,
  coverImage,
  isCustom,
}) => {
  let className = "custom-featured-image";
  if (isCustom) {
    className += " selected";
  }
  return (
    <div
      className={className}
      onClick={isCustom ? removeCustomImage : toggleFileExplorer}
    >
      <span>{isCustom ? "x" : "+"}</span>
      {isCustom && <img alt="" width="100%" src={coverImage} />}
    </div>
  );
};

CustomImage.propTypes = {
  toggleFileExplorer: PropTypes.func,
  removeCustomImage: PropTypes.func,
  coverImage: PropTypes.string,
  isCustom: PropTypes.bool,
};
interface IFeaturedImageProps extends WithNamespaces {
  post: Post;
  updateFeaturedImage: (any) => void;
}

class FeaturedImage extends Component<
  IFeaturedImageProps,
  { imageList: string[]; fileExplorerOpen: boolean; cover_image: string }
> {
  imageInputRef = React.createRef<HTMLInputElement>();
  uploadInputRef = React.createRef<HTMLInputElement>();

  state = {
    cover_image: this.props.post.cover_image,
    fileExplorerOpen: false,
    imageList: [],
  };

  componentDidMount() {
    const imgNodes = document.querySelectorAll(".lp-img");
    if (imgNodes.length === this.state.imageList.length) return;
    const imageList: string[] = [];
    for (let i = 0; i < imgNodes.length; i++) {
      imageList.push(imgNodes[i].getAttribute("src") as string);
    }
    this.setState({ imageList });
  }

  // All the images available in the post can be used as a cover image.
  // This function sets the selection
  setCoverImage = images => {
    PostActions.setData({ cover_image: images[0] });
    this.setState({ cover_image: images[0], fileExplorerOpen: false });
    return false;
  };

  uploadImage = async files => {
    // upload the file and get the url
    const uploadedFiles = await uploadFile({
      files,
      type: "featured_image",
    });
    const { src, errors } = uploadedFiles[0];
    if (errors) {
      notify.show(errors, "error", 3000);
      return;
    }
    this.setCoverImage([src]);
  };

  toggleFileExplorer = () => {
    this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
  };

  render() {
    let isCustom = false;
    if (this.state.cover_image) {
      isCustom = !(this.state.imageList as string[]).includes(
        this.state.cover_image,
      );
    }

    return (
      <div>
        <div className="meta-label">Cover Image</div>
        <ImageWrapper className="images-wrapper">
          <CustomImage
            toggleFileExplorer={this.toggleFileExplorer}
            isCustom={isCustom}
            coverImage={this.state.cover_image}
            removeCustomImage={() => this.setCoverImage([""])}
          />
          {this.state.imageList.map((imagePath, idx) => {
            const selected = imagePath === this.state.cover_image;
            return (
              <div
                key={idx}
                className={selected ? "selected" : ""}
                onClick={() => this.setCoverImage([imagePath])}
              >
                <img alt="" width="100%" src={imagePath} />
              </div>
            );
          })}
        </ImageWrapper>
        <input
          ref={this.imageInputRef}
          className="hide post-image"
          type="file"
          multiple
          onChange={input => this.uploadImage(input.target.files)}
        />
        {this.state.fileExplorerOpen && (
          <FileExplorerModal
            isOpen={this.state.fileExplorerOpen}
            onClose={this.toggleFileExplorer}
            onMediaSelect={this.setCoverImage}
            addNewMedia={() => {
              if (this.imageInputRef.current) {
                this.imageInputRef.current.click();
              }
            }}
          />
        )}
      </div>
    );
  }
}

export default translate("translations")(FeaturedImage);
