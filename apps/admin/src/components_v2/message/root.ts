import { createRoot } from "react-dom/client";

function getRoot() {
  if (typeof document === "undefined") return null;
  const node = document.querySelector("#message");
  if (!node) return null;
}

const createRootForClient = () => {
  const root = getRoot();
  if (!root) {
    return {
      render: () => {},
    };
  }
  return createRoot(root);
};

export const root = createRootForClient();
