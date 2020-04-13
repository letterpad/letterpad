import styled from "styled-components";

const StyledTaxonomy = styled.section`
  .taxonomy-list {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 16px;
    color: var(--color-base);
  }
  .taxonomy-edit {
    border-radius: 4px;
    border: 1px solid var(--color-border);
    padding: 26px;
  }
  .input-box {
    flex: 1;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

export default StyledTaxonomy;

export const Flex = styled.div`
  display: flex;
`;
