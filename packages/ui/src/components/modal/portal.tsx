import { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const Portal: FC<PropsWithChildren> = ({ children }) => {
  if (typeof document === "undefined") {
    return null;
  }
  const el = document.querySelector("#modal-root");
  if (!el) return null;
  return createPortal(<>{children}</>, el);
};
