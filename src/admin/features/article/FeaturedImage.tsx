import { CoverImage, Post } from "../../../__generated__/gqlTypes";
import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

import FileExplorerModal from "../modals/FileExplorerModal";
import { IMediaUploadResult } from "../../../types/types";
import { MediaProvider } from "./Edit";
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
interface ICustomImageProps {
  toggleFileExplorer: () => void;
  removeCustomImage: () => void;
  coverImage: CoverImage;
  isCustom: boolean;
}
const CustomImage: React.FC<ICustomImageProps> = ({
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
      {isCustom && <img alt="" width="100%" src={coverImage.src} />}
    </div>
  );
};

interface IFeaturedImageProps extends WithNamespaces {
  post: Post;
  mediaProvider: MediaProvider;
  updatePost: () => void;
}

class FeaturedImage extends Component<
  IFeaturedImageProps,
  {
    imageList: CoverImage[];
    fileExplorerOpen: boolean;
    cover_image: CoverImage;
    mediaProvider: MediaProvider;
  }
> {
  imageInputRef = React.createRef<HTMLInputElement>();
  uploadInputRef = React.createRef<HTMLInputElement>();

  state = {
    cover_image: PostActions.getData().cover_image,
    fileExplorerOpen: false,
    imageList: [],
    mediaProvider: this.props.mediaProvider,
  };

  componentDidMount() {
    const imgNodes = document.querySelectorAll(".lp-img");
    if (imgNodes.length === this.state.imageList.length) return;
    const imageList: CoverImage[] = [];
    for (let i = 0; i < imgNodes.length; i++) {
      imageList.push({
        src: imgNodes[i].getAttribute("src") as string,
        width: (imgNodes[i].getAttribute("width") as unknown) as number,
        height: (imgNodes[i].getAttribute("height") as unknown) as number,
      });
    }
    this.setState({ imageList });
  }

  // All the images available in the post can be used as a cover image.
  // This function sets the selection
  setCoverImage = async (images: CoverImage[]) => {
    console.log(images);
    PostActions.setData({ cover_image: images[0] });
    await this.props.updatePost();
    this.setState({ cover_image: images[0] });
    return Promise.resolve();
  };

  uploadImage = async files => {
    // upload the file and get the url
    const uploadedFiles: IMediaUploadResult[] = await uploadFile({
      files,
      type: "featured_image",
    });
    const {
      src,
      error,
      size: { width, height },
    } = uploadedFiles[0];
    if (error) {
      notify.show(error, "error", 3000);
      return;
    }
    this.setCoverImage([{ src, width, height }]);
  };

  toggleFileExplorer = () => {
    this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
  };

  render() {
    let isCustom = false;
    if (this.state.cover_image.src) {
      isCustom = !(this.state.imageList as CoverImage[]).includes(
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
            removeCustomImage={() =>
              this.setCoverImage([{ width: 0, height: 0, src: "" }])
            }
          />
          {this.state.imageList.map((imagePath, idx) => {
            const selected = imagePath.src === this.state.cover_image.src;
            return (
              <div
                key={idx}
                className={selected ? "selected" : ""}
                onClick={async () => {
                  const coverImage = {
                    src: imagePath.src,
                    width: imagePath.width || 0,
                    height: imagePath.height || 0,
                  };
                  console.log("coverImage :", coverImage);
                  await this.setCoverImage([coverImage]);
                }}
              >
                <img alt="" width="100%" src={imagePath.src} />
              </div>
            );
          })}
        </ImageWrapper>
        <input
          ref={this.imageInputRef}
          className="hide post-image"
          type="file"
          multiple
        />
        {this.state.fileExplorerOpen && (
          <FileExplorerModal
            switchProvider={provider => {
              this.setState({ mediaProvider: provider });
            }}
            isOpen={this.state.fileExplorerOpen}
            onClose={this.toggleFileExplorer}
            onMediaInsert={this.setCoverImage}
            addNewMedia={() => {
              const inputFile = this.imageInputRef.current;
              if (inputFile) {
                inputFile.onchange = (change: any) => {
                  this.uploadImage(change.target.files);
                  // this.toggleFileExplorer();
                };
                inputFile.click();
              }
            }}
            mediaProvider={this.state.mediaProvider}
          />
        )}
      </div>
    );
  }
}

export default translate("translations")(FeaturedImage);
