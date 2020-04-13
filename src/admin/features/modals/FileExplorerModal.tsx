import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../components/button";
import FileExplorer from "../file-explorer";
import { Image } from "../../../__generated__/gqlTypes";
import { MediaProvider } from "../article/Edit";
import ModalHoc from "../../components/modal";
import { notify } from "react-notify-toast";
import styled from "styled-components";

const StyledBody = styled.div`
  .grid {
    height: calc(100vh - 248px);
  }
`;

interface IProps extends WithNamespaces {
  onMediaInsert: (images: { [urls: string]: Image }) => void;
  onClose: () => void;
  mediaProvider: MediaProvider;
  addNewMedia: () => void;
  isOpen: boolean;
  switchProvider: (mediaProvider: MediaProvider) => void;
}
interface IState {
  page: number;
  selectedImageUrls: { [url: string]: Image };
}
class FileExplorerModal extends Component<IProps, IState> {
  state = {
    page: 1,
    selectedImageUrls: {},
  };

  onSelect = (images: { [url: string]: Image }) => {
    this.setState({ selectedImageUrls: images });
  };

  onPageClick = (e, page) => {
    e.preventDefault();
    this.setState({ page });
  };

  insertMedia = async () => {
    // get only the urls in an array
    try {
      await this.props.onMediaInsert(this.state.selectedImageUrls);
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
          <Button onClick={onClose}>
            <i className="fa fa-close" />
            {t("common.cancel")}
          </Button>
          <Button
            btnStyle="flat"
            onClick={() => {
              this.setState({ selectedImageUrls: {}, page: 1 });
              switchProvider(nextProvider);
            }}
          >
            {mediaProvider === MediaProvider.Letterpad
              ? "Search Online"
              : "My Media"}
          </Button>
          <Button onClick={addNewMedia} btnStyle="primary">
            <i className="fa fa-search" /> Browse
          </Button>
          {enableInsert && (
            <Button btnStyle="primary" onClick={this.insertMedia}>
              <i className="fa fa-arrow-circle-down" />
              Insert
            </Button>
          )}
        </div>
      </ModalHoc>
    );
  }
}

export default translate("translations")(FileExplorerModal);
