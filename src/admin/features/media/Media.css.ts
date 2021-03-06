import styled from "styled-components";

export const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledMedia = styled.div`
  display: grid;
  grid-template-areas: "header header" "nav content" "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  background: var(--bg-base);
  color: var(--color-base);
  min-height: 100vh;

  ::-webkit-input-placeholder {
    color: var(--color-muted) !important;
    font-weight: 300;
  }
`;

export const EditMediaWrapper = styled.div`
  @media (max-width: 992px) {
    .open .modal-wrapper {
      height: 92vh;
    }
  }
`;

export const StyledItem = styled.div`
  .selection-box {
    position: relative;
    z-index: 99;
    left: 100%;
    margin-left: -24px;
    border-top-right-radius: 7px;
    top: 10px;
  }

  [type="checkbox"] {
    position: absolute;
    left: -9999px;
  }
  [type="checkbox"] + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
  }
  [type="checkbox"] + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0px;
    width: 18px;
    height: 18px;
    border: 1px solid #fff;
    background: #fff;
    box-shadow: 0px 0px 4px 1px #0000005c;
    border-radius: 50%;
  }
  [type="checkbox"] + label:after {
    content: "";
    width: 10px;
    height: 10px;
    background: #00a69c;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    transition: all 0.1s ease;
  }
`;
