import styled from "styled-components";

export const Container = styled.div`
  background: var(--bg-sections);
  padding: 16px;
  border: 1px solid var(--color-border);
  .toolbar {
    margin-bottom: 40px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 20px 200px 300px 20px 20px;
  grid-gap: 10px;
  align-items: baseline;
`;
