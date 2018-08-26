import React from "react";
import PropTypes from "prop-types";

import ModalHoc from "../../components/modal";
import StyledModalWrapper from "./ModalWrapper.css";

const EditMenuModal = (props, context) => {
    const { t } = context;
    return (
        <StyledModalWrapper>
            <ModalHoc onClose={props.onClose} title={props.title}>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="custom-label">
                            {t("common.title")}
                        </label>
                        <input
                            defaultValue={props.nodeInfo.node.name}
                            type="text"
                            className="form-control"
                            placeholder="Display name in menu"
                            onBlur={e =>
                                props.changeItemProperty(
                                    e,
                                    props.nodeInfo,
                                    "name"
                                )
                            }
                        />
                    </div>
                    {props.nodeInfo.node.type !== "folder" && (
                        <div className="form-group">
                            <label className="custom-label">
                                {t("common.slug")}
                            </label>
                            <input
                                defaultValue={props.nodeInfo.node.slug}
                                type="text"
                                className="form-control"
                                disabled={props.nodeInfo.node.type == "page"}
                                placeholder="Enter the path for navigation"
                                onBlur={e =>
                                    props.changeItemProperty(
                                        e,
                                        props.nodeInfo,
                                        "slug"
                                    )
                                }
                            />
                            {props.nodeInfo.node.type == "page" && (
                                <small>(You cannot edit slugs of pages)</small>
                            )}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button
                        onClick={props.onClose}
                        type="button"
                        className="btn btn-xs btn-dark"
                    >
                        Ok
                    </button>
                </div>
            </ModalHoc>
        </StyledModalWrapper>
    );
};
EditMenuModal.propTypes = {
    nodeInfo: PropTypes.object.isRequired,
    changeItemProperty: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

EditMenuModal.contextTypes = {
    t: PropTypes.func
};

export default EditMenuModal;
