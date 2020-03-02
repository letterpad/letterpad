import styled from "styled-components";

const StyledTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  padding: 10px 20px;
  z-index: 999;
  background: var(--bg-base);
  .left-block {
    display: flex;
    align-items: center;
  }
  .right-block {
    display: flex;
    align-items: center;
  }
`;

export const PublishBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  a:hover {
    text-decoration: none;
  }
  .meta-label {
    font-weight: 500;
    margin-bottom: 10px;
  }
  > div {
    margin-left: 20px;
    cursor: pointer;
  }
  .publish {
    .dropdown-menu {
      width: 340px;
      margin-left: -190px;
    }
  }
  .meta {
    .dropdown-menu {
      width: 320px;
      margin-left: -240px;
    }
  }
`;

export const PostStatusText = styled.span<{ status: string }>`
  font-size: 11px;
  margin-left: 30px;
  border: 1px solid var(--color-border);
  padding: 3px 6px;
  border-radius: 4px;
  color: ${p =>
    p.status === "publish"
      ? "var(--bg-success)"
      : p.status === "draft"
      ? "#ce8809"
      : "var(--bg-danger)"};
`;

export const AutoSaveIndicator = styled.div`
  .spinner {
    width: 70px;
    text-align: center;
  }

  .spinner > div {
    width: 6px;
    height: 6px;
    background-color: #0eaf10;
    margin-right: 4px;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
    background-color: #27b0ed;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    background-color: #f33f43;
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;

export default StyledTopBar;
