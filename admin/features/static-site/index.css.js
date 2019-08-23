import styled from "styled-components";

export const ProgressBar = styled.div`
  width: 400px;
  @media (max-width: 500px) {
    width: 100%;
  }
  height: 14px;
  background: var(--bg-primary);
  border: 1px solid var(--color-border);
  overflow: hidden;
  border-radius: 4px;
  span {
    height: 100%;
    background: var(--bg-success);
    color: var(--base-shade-7);
    text-align: center;
    font-size: 8px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    transform: translateX(calc(-100%));
    transition: 0.1s transform linear;
  }
`;

export const ProgressText = styled.div`
  span {
    padding-left: 8px;
    font-size: 12px;
    font-weight: bold;
    color: var(--base-shade-3);
    font-weight: 500;
    line-height: 20px;
  }
`;
export const Spinner = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;

  &:after {
    content: " ";
    display: block;
    width: 6px;
    height: 8px;
    margin: -2px;
    border-radius: 50%;
    border: 2px solid var(--base-shade-7);
    border-color: var(--base-shade-7) transparent var(--base-shade-7)
      transparent;
    animation: lds-dual-ring 0.5s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Warning = styled.div`
  font-size: 10px;
  font-style: italic;
  color: #f4602f;
`;
