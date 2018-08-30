import React from "react";
import PropTypes from "prop-types";

import ModalHoc from "../../components/modal";
import StyledInput from "../../components/input";
import StyledButton from "../../components/button";

const EditMenuModal = (props, context) => {
    const { t } = context;
    return (
        <ModalHoc confirm onClose={props.onClose} title={props.title}>
            <div className="modal-body">
                <StyledInput
                    label={t("common.title")}
                    defaultValue={props.nodeInfo.node.name}
                    type="text"
                    placeholder="Display name in menu"
                    onBlur={e =>
                        props.changeItemProperty(e, props.nodeInfo, "name")
                    }
                />

                {props.nodeInfo.node.type !== "folder" && (
                    <div>
                        <StyledInput
                            label={t("common.slug")}
                            defaultValue={props.nodeInfo.node.slug}
                            type="text"
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
                <StyledButton onClick={props.onClose}>Cancel</StyledButton>
                <StyledButton onClick={props.onClose} success>
                    Ok
                </StyledButton>
            </div>
        </ModalHoc>
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
