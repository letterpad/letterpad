import { Button } from "../../components/button";
import ModalHoc from "../../components/modal";
import React from "react";

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
        <Button onClick={props.onClose}>Cancel</Button>
        <Button btnStyle="danger" onClick={props.onYes}>
          Continue
        </Button>
      </div>
    </ModalHoc>
  );
};
export default ConfirmDelete;
