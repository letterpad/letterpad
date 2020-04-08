import { device } from "./../devices";
import styled from "styled-components";

export const Container = styled.div`
  padding: 40px 0px;
  border-radius: 2px;
  border-top: 1px solid var(--color-border);
  .toolbar {
    margin-bottom: 40px;
  }
  button {
    border-radius: 2px;
  }
  input {
    background: transparent !important;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 20px 200px 1fr 20px 20px;
  grid-gap: 10px;
  align-items: baseline;

  @media ${device.tablet} {
    .fa-info {
      display: none;
    }
    grid-template-columns: 20px 100px 1fr 20px;
  }
`;
