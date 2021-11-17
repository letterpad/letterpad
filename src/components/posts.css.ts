import css from "styled-jsx/css";

export const postsStyles = css`
  :global(.post-status) {
    width: 10px;
    height: 10px;
    display: block;
    border-radius: 50%;
    margin-left: 10px;
  }
  :global(.post-status-published) {
    background: green;
  }
  :global(.post-status-draft) {
    background: orange;
  }
`;
