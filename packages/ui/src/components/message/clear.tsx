import { portal } from "./root";

let timeout;
export const clearText = (DELAY) => {
  clearTimeout(timeout);
  if (DELAY === 0) {
    return portal.show(<span />);
  }
  timeout = setTimeout(() => {
    portal.show(<span />);
  }, DELAY * 1000);
};
