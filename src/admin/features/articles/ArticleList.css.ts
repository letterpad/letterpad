import styled from "styled-components";

export const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RoundedCheckbox = styled.div`
  position: relative;
  z-index: 99;
  left: 100%;
  margin-left: -24px;
  border-top-right-radius: 7px;
  top: 10px;

  [type="checkbox"]:checked,
  [type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="checkbox"]:checked + label,
  [type="checkbox"]:not(:checked) + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
  }
  [type="checkbox"]:checked + label:before,
  [type="checkbox"]:not(:checked) + label:before {
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
  [type="checkbox"]:checked + label:after,
  [type="checkbox"]:not(:checked) + label:after {
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
  [type="checkbox"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type="checkbox"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

export const List = styled.div`
  article,
  header {
    display: grid;
    grid-gap: 10px;
    align-items: center;
    grid-template-columns: 100px 1fr 100px 100px 100px 100px;
    font-size: 0.95rem;
    color: var(--color-text-3);
    margin-bottom: 44px;
    .title {
      font-size: 1rem;
      margin-bottom: 4px;
      color: var(--color-base);
      .small {
        color: var(--color-text-3);
        font-size: 0.95rem;
      }
    }
    .status div {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      &.publish {
        background: #49d049;
      }
      &.draft {
        background: #e8bd6e;
      }
      &.trash {
        background: #e4480b;
      }
    }
    .cover-image div {
      border-radius: 4px;
    }

    @media (max-width: 767px) {
      .cover-image,
      .author,
      .status,
      .tags,
      .published {
        display: none;
      }
      display: flex;
      flex-direction: row;
      > div {
        width: 100%;
      }
    }
    @media (min-width: 767px) and (max-width: 1300px) {
      grid-template-columns: minmax(300px, 1fr) auto 100px 100px;
      .cover-image,
      .tags {
        display: none;
      }
    }
  }
  header {
    div {
      color: var(--color-base) !important;
      text-transform: uppercase;
      font-size: 0.7rem !important;
      letter-spacing: 1px;
    }
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 12px;
    margin-bottom: 38px;
  }
  @media (max-width: 767px) {
    header {
      display: none !important;
    }
    article {
      margin-bottom: 24px;
      display: flex;

      /* flex-direction: row-reverse; */
      align-items: center;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  .input-box {
    margin: 0px;
  }
`;
