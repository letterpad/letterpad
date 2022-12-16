import { root } from "./root";

let timeout;
export const clearText = (DELAY) => {
  clearTimeout(timeout);
  if (DELAY === 0) {
    return root.render(<span />);
  }
  timeout = setTimeout(() => {
    root.render(<span />);
  }, DELAY * 1000);
};
