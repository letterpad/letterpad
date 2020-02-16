import React from "react";

import StyledButton from "../../components/button";
import ModalHoc from "../../components/modal";

interface IConfirmDeleteProps {
  onClose: () => void;
  onYes: () => void;
  text: string;
  title: string;
}

const ConfirmDelete: React.FC<IConfirmDeleteProps> = props => {
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
export default ConfirmDelete;
