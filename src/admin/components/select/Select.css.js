import styled from "styled-components";

const StyledSelect = styled.div`
  label {
    color: var(--base-shade-3);
    font-weight: 500;
    font-size: 13px;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
  }
  ${props => props.bold && "font-weight: 500; font-size: 13px;"};
  display: inline-block;
  ${props => props.block && "display:block"};
  .select-name {
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  ul.options {
    position: absolute;
    background: var(--bg-base);
    z-index: 999;
    li {
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      transition: all 0.2s linear;
      min-width: 120px;
      padding: 10px 8px;
      &:first-child {
        border-top: 1px solid var(--color-border);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      &:last-child {
        border-bottom: 1px solid var(--color-border);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:hover,
      &.selected {
        background: var(--color-accent);
        cursor: pointer;
      }
    }
  }
`;

export default StyledSelect;
