import React, { Component } from "react";

import FileExplorer from "../file-explorer";
import ModalHoc from "../../components/modal";
import StyledButton from "../../components/button";
import styled from "styled-components";
// import PropTypes from "prop-types";
import { translate } from "react-i18next";

const StyledBody = styled.div`
  .grid {
    height: calc(100vh - 248px);
  }
`;

class FileExplorerModal extends Component<any, any> {
  state = {
    page: 1,
    selectedImageUrls: [],
  };

  onSelect = images => {
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
          <FileExplorer multi={true} onSelect={this.onSelect} />
          <div className="p-t-20" />
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
              onClick={() =>
                this.props.onMediaSelect(this.state.selectedImageUrls)
              }
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
