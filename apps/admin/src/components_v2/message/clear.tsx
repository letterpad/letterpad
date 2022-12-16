import ReactDom from "react-dom";

let timeout;
export const clearText = (node, DELAY) => {
  clearTimeout(timeout);
  if (DELAY === 0) {
    return ReactDom.render(<span />, node);
  }
  timeout = setTimeout(() => {
    ReactDom.render(<span />, node);
  }, DELAY * 1000);
};
