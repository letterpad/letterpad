import styled from "styled-components";

export const StyledCheckbox = styled.div`
  text-align: center;
  display: block;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    & + label {
      position: relative;
      cursor: pointer;
      padding: 0;
      top: 14px;
      border-radius: 4px;
    }

    /* // Box. */
    & + label:before {
      content: "";
      margin-right: 10px;
      display: inline-block;
      vertical-align: text-top;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      /* background: var(--base-shade-2); */
      border: 1px solid var(--color-border);
    }

    /* // Box hover */
    &:hover + label:before {
      /* background: #f35429; */
    }

    /* // Box focus
        &:focus + label:before {
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
        } */

    /* // Box checked */
    &:checked + label:before {
      /* background: #f35429; */
    }

    /* // Disabled state label. */
    &:disabled + label {
      color: #b8b8b8;
      cursor: auto;
    }

    /* // Disabled box. */
    &:disabled + label:before {
      box-shadow: none;
      background: #ddd;
    }

    /* // Checkmark. Could be replaced with an image */
    &:checked + label:after {
      content: "";
      position: absolute;
      left: 4px;
      top: 4px;
      background: white;
      width: 8px;
      height: 8px;
      border-radius: 15px;
      background: #f35429;
      border: 1px solid var(--color-border);
    }
  }

  @media (max-width: 767px) {
    flex: 1;
    padding-left: 0px;
    padding-right: 16px;
  }
`;
