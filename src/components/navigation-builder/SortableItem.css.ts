import { Grid } from "./Navigation.css";
import styled from "styled-components";

export const Item = styled(Grid)`
  i {
    cursor: pointer;
  }
  .dragger {
    cursor: move;
  }
  .icon-box {
    padding-top: 4px;
  }

  /* input {
    padding: 8px 6px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    width: 100%;
    background: var(--bg-base);
    color: var(--color-base);
  } */

  .input-box {
    height: 40px;
    display: flex;
    flex-direction: column;
  }
`;

interface IInputProps {
  hasError: boolean;
}
export const InputBox = styled.div<IInputProps>`
  input {
    ${p => (p.hasError ? `border: 1px solid orange` : "")}
  }
  display: flex;
  flex: 1;
  flex-direction: column;
  .error {
    height: 20px;
    font-size: 0.7rem;
    color: orange;
  }
`;
