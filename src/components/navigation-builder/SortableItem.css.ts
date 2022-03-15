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
    ${(p) => (p.hasError ? `border: 1px solid orange` : "")}
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
