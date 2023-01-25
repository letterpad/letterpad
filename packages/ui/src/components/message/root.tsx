import { ReactNode } from "react";
import { createRoot } from "react-dom/client";

function getRoot() {
  if (typeof document === "undefined") return null;
  const node = document.querySelector("#message");
  if (!node) return null;
  return createRoot(node);
}

const createRootForClient = () => {
  const root = getRoot();
  if (!root) {
    return {
      show: () => {},
    };
  }

  return {
    show: (node: ReactNode) => {
      root.render(node);
    },
  };
};

export const portal = createRootForClient();
