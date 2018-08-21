import React from "react";
import PropTypes from "prop-types";

import config from "config";
import ModalHoc from "./ModalHoc";

const ConfirmDelete = props => {
    return (
        <div>
            <div className="modal-header">
                <button onClick={props.onClose} className="close">
                    ×
                </button>
                <h4 className="modal-title">{props.title}</h4>
            </div>
            <div className="modal-body text-center">
                {props.text}
                <div className="p-t-20">
                    <img width="300" src={config.baseName + props.media.url} />
                </div>
            </div>
            <div className="modal-footer">
                <button
                    onClick={props.onYes}
                    type="button"
                    className="btn btn-xs btn-dark"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
ConfirmDelete.propTypes = {
    onClose: PropTypes.func.isRequired,
    onYes: PropTypes.func.isRequired,
    text: PropTypes.string,
    media: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};
export default ModalHoc(ConfirmDelete);
