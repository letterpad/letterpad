import styled from "styled-components";

export const SearchInputBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  input {
    width: 100%;
    border: 1px solid var(--color-border);
    padding: 8px 16px;
    padding-right: 32px;
    border-radius: 20px;
  }
  i {
    left: -26px;
  }
  padding-bottom: 16px;
`;

export const Container = styled.div`
  .modal-body {
    overflow: hidden !important;
  }
`;

export const SearchItemGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  text-align: left;
  height: calc(min-content);
  header {
    border-bottom: 1px solid var(--color-border);
    width: 100%;
    text-transform: uppercase;
    font-size: 0.8rem;
    padding-bottom: 8px;
    color: var(--color-muted);
  }
`;

export const SearchBody = styled.div`
  margin-top: 16px;
  height: 400px;
  overflow-y: auto;
  .search-results-item {
    padding: 4px 0px;
    display: block;
  }
`;
