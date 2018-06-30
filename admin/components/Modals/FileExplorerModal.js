import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalHoc from "../../components/ModalHoc";
import FileExplorer from "../../containers/FileExplorer/FileExplorer";

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
        const { t } = this.context;
        return (
            <React.Fragment>
                <div className="modal-header">
                    <button onClick={this.props.onClose} className="close">
                        ×
                    </button>
                    <h4
                        className="modal-title"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingRight: 26
                        }}
                    >
                        <span>{t("modal.explorer.title")}</span>
                        <button
                            onClick={this.props.addNewMedia}
                            type="button"
                            className="btn btn-xs btn-dark"
                        >
                            Add New Item
                        </button>
                    </h4>
                </div>
                <div className="modal-body text-center">
                    <FileExplorer
                        author={{ id: 1 }}
                        page={this.state.page}
                        onPageClick={this.onPageClick}
                        onSelect={this.onSelect}
                    />
                    <div className="p-t-20" />
                </div>
                <div className="modal-footer">
                    <button
                        onClick={() =>
                            this.props.onMediaSelect(
                                this.state.selectedImageUrl
                            )
                        }
                        type="button"
                        className="btn btn-xs btn-dark"
                    >
                        Ok
                    </button>
                    <button
                        onClick={this.props.onClose}
                        type="button"
                        className="btn btn-xs btn-default"
                    >
                        {t("common.cancel")}
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

FileExplorerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    addNewMedia: PropTypes.func.isRequired,
    onMediaSelect: PropTypes.func.isRequired
};
FileExplorerModal.contextTypes = {
    t: PropTypes.func
};
export default ModalHoc(
    FileExplorerModal,
    null,
    "full-width-modal file-explorer"
);
