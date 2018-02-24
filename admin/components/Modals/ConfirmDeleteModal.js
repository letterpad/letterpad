import React from "react";
import ModalHoc from "../ModalHoc";

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
                    <img width="300" src={props.media.url} />
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

module.exports = ModalHoc(ConfirmDelete);
