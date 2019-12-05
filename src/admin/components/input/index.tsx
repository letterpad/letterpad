import React, { ChangeEvent, Ref } from "react";
import { Container } from "./Input.css";

interface IInputProps {
  label?: string;
  placeholder: string;
  value?: string;
  ref?: Ref<HTMLInputElement>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e) => void;
}

const Input: React.FC<IInputProps> = ({ label, ...props }) => {
  return (
    <Container className="input-box">
      {label && (
        <label
          className="custom-label"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}
      <input {...props} />
    </Container>
  );
};

interface ITextareaProps {
  label: string;
  placeholder: string;
  ref?: Ref<HTMLTextAreaElement>;
  cols?: number;
  rows: number;
  value?: string;
}

export const TextArea: React.FC<ITextareaProps> = ({
  label,
  value,
  ...props
}) => {
  return (
    <Container className="input-box">
      {label && (
        <label
          className="custom-label"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}
      <textarea {...props}>{value || ""}</textarea>
    </Container>
  );
};

export default Input;
