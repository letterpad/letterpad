import styled from "styled-components";

const Wrapper = styled.article`
  margin: 8px 0px;
  border: 5px solid transparent;

  cursor: pointer;
  .status {
    display: none;
  }
  &.active .status {
    display: inline-block;
    background: var(--color-accent);
    color: var(--color-base);
    position: absolute;
    padding: 5px 8px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .theme-meta {
    height: 80px;
    font-size: 13px;
  }
  .theme-thumbnail {
    position: relative;
    min-height: 160px;
    .status {
      position: absolute;
    }

    .theme-image {
      height: 180px;
      object-fit: contain;
      width: 100%;
      border-radius: 2px;
      border: 1px solid var(--color-border);
      background: var(--bg-base);
    }
  }
  .theme-header {
    padding: 12px 0px;
    .theme-name {
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
  }
`;

export default Wrapper;
