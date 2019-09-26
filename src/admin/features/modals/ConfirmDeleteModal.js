import React from "react";
import PropTypes from "prop-types";

import StyledButton from "../../components/button";
import ModalHoc from "../../components/modal";

const ConfirmDelete = props => {
  return (
    <ModalHoc confirm onClose={props.onClose} title={props.title}>
      <div className="modal-body">{props.text}</div>
      <div className="modal-footer">
        <StyledButton sm onClick={props.onClose}>
          Cancel
        </StyledButton>
        <StyledButton sm danger onClick={props.onYes}>
          Continue
        </StyledButton>
      </div>
    </ModalHoc>
  );
};
ConfirmDelete.propTypes = {
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.string,
  media: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};
export default ConfirmDelete;
