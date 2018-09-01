import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import styled from "styled-components";
import ModalHoc from "../../components/modal";
import StyledButton from "../../components/button";
import FileExplorer from "../file-explorer";

const StyledBody = styled.div`
    .grid {
        height: calc(100vh - 248px);
    }
`;

class FileExplorerModal extends Component {
    state = {
        page: 1,
        selectedImageUrl: ""
    };

    onSelect = coverImage => {
        this.setState({ selectedImageUrl: coverImage });
    };

    onPageClick = (e, page) => {
        e.preventDefault();
        this.setState({ page });
    };

    render() {
        const { t } = this.props;

        return (
            <ModalHoc
                confirm
                title={t("modal.explorer.title")}
                onClose={this.props.onClose}
            >
                <StyledBody className="modal-body text-center">
                    <FileExplorer
                        author={{ id: 1 }}
                        page={this.state.page}
                        onPageClick={this.onPageClick}
                        onSelect={this.onSelect}
                    />
                    <div className="p-t-20" />
                </StyledBody>
                <div className="modal-footer">
                    <StyledButton onClick={this.props.onClose}>
                        {t("common.cancel")}
                    </StyledButton>
                    <StyledButton onClick={this.props.addNewMedia}>
                        Add New Item
                    </StyledButton>
                    <StyledButton
                        success
                        onClick={() =>
                            this.props.onMediaSelect(
                                this.state.selectedImageUrl
                            )
                        }
                    >
                        Insert
                    </StyledButton>
                </div>
            </ModalHoc>
        );
    }
}

FileExplorerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    addNewMedia: PropTypes.func.isRequired,
    onMediaSelect: PropTypes.func.isRequired,
    t: PropTypes.func
};

export default translate("translations")(FileExplorerModal);
