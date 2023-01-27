import { portal } from "./root";

let timeout: NodeJS.Timeout;
export const clearText = (DELAY = 3) => {
  if (DELAY === 0) {
    return portal.show(<span />);
  }
  timeout = setTimeout(() => {
    portal.show(<span />);
  }, DELAY * 1000);
};
