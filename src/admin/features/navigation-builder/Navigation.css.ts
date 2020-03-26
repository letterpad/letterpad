import styled from "styled-components";

export const Container = styled.div`
  .toolbar {
    margin-bottom: 40px;
    button {
      padding: 8px 15px;
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 20px 200px 300px 20px 20px;
  grid-gap: 10px;
  align-items: baseline;
`;
