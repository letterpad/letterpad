import { device } from "../../features/devices";
import styled from "styled-components";

const StyledSelect = styled.div<any>`
  label {
    font-weight: 400;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
  }
  ${props => props.bold && "font-weight: 500; font-size: 13px;"};
  display: inline-block;
  ${props => props.block && "display:block"};

  @media ${device.mobile} {
    font-size: 0.8rem;
  }
  .select-name {
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: 400;
  }
  ul.options {
    position: absolute;
    background: var(--bg-base);
    z-index: 999;
    li {
      font-weight: 300;
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      min-width: 120px;
      padding: 6px 8px;
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
        font-weight: bold;
        cursor: pointer;
        color: var(--color-accent);
      }
    }
  }
`;

export default StyledSelect;
