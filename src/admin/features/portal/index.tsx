import { createPortal } from "react-dom";
import { useEffect } from "react";

const Portal = ({ children }) => {
  const mount = document.getElementById("portal-root");
  const el = document.createElement("div");

  useEffect(() => {
    if (mount) {
      mount.appendChild(el);
      return () => {
        mount.removeChild(el);
      };
    }
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;
