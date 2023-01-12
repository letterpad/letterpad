import { createPortal } from "react-dom";

export const Portal = ({ children }) => {
  if (typeof document === "undefined") {
    return null;
  }
  const el = document.querySelector("#modal-root");
  if (!el) return null;
  return createPortal(children, el);
};
