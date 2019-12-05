import styled from "styled-components";

export const Container = styled.div`
  label {
    color: var(--base-shade-3);
    font-weight: 500;
    font-size: 13px;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
  }
  input,
  textarea {
    border: 0px;
    border-bottom: 1px solid var(--color-border);
    padding: 13px 0px;
    font-size: 14px;
    border-radius: 0px;
    box-shadow: none;
    transition: 0.3s border-color linear;
    background: transparent;
    display: block;
    width: 100%;
    line-height: 1.42857143;
    height: 36px;
    &::-webkit-input-placeholder {
      color: var(--base-shade-3);
    }
    color: var(--color-base);

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: pink;
    }
    &::-moz-placeholder {
      /* Firefox 19+ */
      color: pink;
    }
    &:-ms-input-placeholder {
      /* IE 10+ */
      color: pink;
    }
    &:-moz-placeholder {
      /* Firefox 18- */
      color: pink;
    }
  }
  textarea {
    height: auto;
  }
  margin-bottom: 15px;
`;
