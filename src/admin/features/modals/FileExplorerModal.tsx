import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { CoverImage } from "../../../__generated__/gqlTypes";
import FileExplorer from "../file-explorer";
import { MediaProvider } from "../article/Edit";
import ModalHoc from "../../components/modal";
import StyledButton from "../../components/button";
import { notify } from "react-notify-toast";
import styled from "styled-components";

const StyledBody = styled.div`
  .grid {
    height: calc(100vh - 248px);
  }
`;

interface IProps extends WithNamespaces {
  onMediaInsert: (urls: string[]) => Promise<any>;
  onClose: () => void;
  mediaProvider: MediaProvider;
  addNewMedia: () => void;
  isOpen: boolean;
  switchProvider: (mediaProvider: MediaProvider) => void;
}

class FileExplorerModal extends Component<IProps, any> {
  state = {
    page: 1,
    selectedImageUrls: [],
  };

  onSelect = (images: { [url: string]: CoverImage }) => {
    this.setState({ selectedImageUrls: images });
  };

  onPageClick = (e, page) => {
    e.preventDefault();
    this.setState({ page });
  };

  insertMedia = async () => {
    // get only the urls in an array
    const urls = Object.keys(this.state.selectedImageUrls);
    try {
      await this.props.onMediaInsert(urls);
    } catch (e) {
      notify.show("Something unexpected happened.", "error");
    }
    setTimeout(this.props.onClose, 0);
  };

  render() {
    const {
      t,
      mediaProvider,
      onClose,
      addNewMedia,
      switchProvider,
    } = this.props;

    const nextProvider =
      mediaProvider === MediaProvider.Letterpad
        ? MediaProvider.Unsplash
        : MediaProvider.Letterpad;
    const enableInsert = Object.keys(this.state.selectedImageUrls).length > 0;
    return (
      <ModalHoc confirm title={t("modal.explorer.title")} onClose={onClose}>
        <StyledBody className="modal-body text-center">
          <FileExplorer
            multi={true}
            onSelect={this.onSelect}
            mediaProvider={mediaProvider}
          />
        </StyledBody>
        <div className="modal-footer">
          <StyledButton onClick={onClose}>{t("common.cancel")}</StyledButton>
          <StyledButton onClick={addNewMedia}>Browse</StyledButton>
          <StyledButton
            onClick={() => {
              this.setState({ selectedImageUrls: [], page: 1 });
              switchProvider(nextProvider);
            }}
          >
            {mediaProvider === MediaProvider.Letterpad
              ? "Search Online"
              : "My Media"}
          </StyledButton>
          {enableInsert && (
            <StyledButton success onClick={this.insertMedia}>
              Insert
            </StyledButton>
          )}
        </div>
      </ModalHoc>
    );
  }
}

export default translate("translations")(FileExplorerModal);
