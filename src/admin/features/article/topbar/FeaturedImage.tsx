import { Image, Post } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

import FileExplorerModal from "../../modals/FileExplorerModal";
import { IMediaUploadResult } from "../../../../types/types";
import { MediaProvider } from "../Edit";
import Portal from "../../portal";
import PostActions from "../PostActions";
import { notify } from "react-notify-toast";
import styled from "styled-components";
import { uploadFile } from "../../../server/util";

interface IFeaturedImageProps extends WithNamespaces {
  post: Post;
  mediaProvider: MediaProvider;
}

class FeaturedImage extends Component<
  IFeaturedImageProps,
  {
    imageList: Image[];
    fileExplorerOpen: boolean;
    cover_image: Image;
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

  // All the images available in the post can be used as a cover image.
  // This function sets the selection
  setImage = async (images: { [urls: string]: Image }) => {
    const cover_image = Object.values(images)[0];
    PostActions.setDraft({ cover_image });
    await PostActions.updatePost();
    this.setState({ cover_image });
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
    await this.setImage({ void: { src, width, height } });
    this.toggleFileExplorer();
  };

  toggleFileExplorer = () => {
    this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
  };

  render() {
    let isCustom = false;
    let { imageList, cover_image } = this.state;
    if (cover_image.src) {
      isCustom = !(imageList as Image[]).includes(cover_image);
    }

    return (
      <div>
        <label>Cover Image</label>
        <ImageWrapper className="images-wrapper">
          <CustomImage
            toggleFileExplorer={this.toggleFileExplorer}
            isCustom={isCustom}
            Image={cover_image}
            removeCustomImage={() =>
              this.setImage({
                void: { width: 0, height: 0, src: "" },
              })
            }
          />
        </ImageWrapper>
        <input
          ref={this.imageInputRef}
          className="hide post-image"
          type="file"
          multiple
        />
        {this.state.fileExplorerOpen && (
          <Portal>
            <FileExplorerModal
              switchProvider={provider => {
                this.setState({ mediaProvider: provider });
              }}
              isOpen={this.state.fileExplorerOpen}
              onClose={this.toggleFileExplorer}
              onMediaInsert={this.setImage}
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
          </Portal>
        )}
      </div>
    );
  }
}

export default translate("translations")(FeaturedImage);

interface ICustomImageProps {
  toggleFileExplorer: () => void;
  removeCustomImage: () => void;
  Image: Image;
  isCustom: boolean;
}
const CustomImage: React.FC<ICustomImageProps> = ({
  removeCustomImage,
  toggleFileExplorer,
  Image,
  isCustom,
}) => {
  let className = "custom-featured-image";
  if (isCustom) {
    className += " selected";
  }
  if (!Image.src) {
    className += " no-image";
  }
  return (
    <div
      className={className}
      onClick={isCustom ? removeCustomImage : toggleFileExplorer}
    >
      <span className="handler">{Image.src ? "✕" : "+"}</span>
      {isCustom && <img alt="" width="100%" src={Image.src} />}
    </div>
  );
};

const ImageWrapper = styled.div`
  overflow-x: auto;
  display: flex;
  .handler {
    position: absolute;
    background: #000;
    padding: 6px 14px;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 2rem;
    cursor: pointer;
    color: #fff;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 0.3s linear opacity;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
  .custom-featured-image {
    width: 100%;
    min-height: 70px;
    background: #000;
    position: relative;

    &.no-image .handler {
      opacity: 1;
    }
  }
`;
