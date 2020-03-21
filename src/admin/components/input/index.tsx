import React, { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from "react";
import { Container } from "./Input.css";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ref?: Ref<HTMLInputElement>;
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
export default Input;

interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export const TextArea: React.FC<ITextareaProps> = ({ label, ...props }) => {
  return (
    <Container className="input-box">
      {label && (
        <label
          className="custom-label"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}
      <textarea rows={2} {...props}></textarea>
    </Container>
  );
};

export const Label: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Container>
      {label && (
        <label
          className="custom-label"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      )}
    </Container>
  );
};
