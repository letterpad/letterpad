import styled from "styled-components";

export const Item = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row;
  > div {
    display: flex;
  }

  .dragger {
    cursor: move;
  }
  .icon-box {
    padding-top: 4px;
  }

  input {
    padding: 6px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    min-width: 300px;
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
    ${p => (p.hasError ? `border: 1px solid orange` : "")}
  }
  display: flex;
  flex-direction: column;
  .error {
    height: 20px;
    font-size: 0.7rem;
    color: orange;
  }
`;
