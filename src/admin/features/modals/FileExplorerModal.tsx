import React, { Component } from "react";
import { WithNamespaces, translate } from "react-i18next";

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
}

class FileExplorerModal extends Component<IProps, any> {
  state = {
    page: 1,
    selectedImageUrls: [],
  };

  onSelect = (images: string[]) => {
    this.setState({ selectedImageUrls: images });
  };

  onPageClick = (e, page) => {
    e.preventDefault();
    this.setState({ page });
  };

  render() {
    const { t } = this.props;
    const enableInsert = this.state.selectedImageUrls.length > 0;
    return (
      <ModalHoc
        confirm
        title={t("modal.explorer.title")}
        onClose={this.props.onClose}
      >
        <StyledBody className="modal-body text-center">
          <FileExplorer
            multi={true}
            onSelect={this.onSelect}
            mediaProvider={this.props.mediaProvider}
          />
        </StyledBody>
        <div className="modal-footer">
          <StyledButton onClick={this.props.onClose}>
            {t("common.cancel")}
          </StyledButton>
          <StyledButton onClick={this.props.addNewMedia}>
            Add New Item
          </StyledButton>
          {enableInsert && (
            <StyledButton
              success
              onClick={async () => {
                try {
                  await this.props.onMediaInsert(this.state.selectedImageUrls);
                } catch (e) {
                  notify.show("Something unexpected happened.", "error");
                }
                setTimeout(this.props.onClose, 0);
              }}
            >
              Insert
            </StyledButton>
          )}
        </div>
      </ModalHoc>
    );
  }
}

export default translate("translations")(FileExplorerModal);
