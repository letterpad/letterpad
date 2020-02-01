import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledHeading = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: bold;
  margin: 16px 0px 8px 8px;
  letter-spacing: 1px;
`;
export const MenuItem = styled.li``;

export const StyledLink = styled(Link)`
  display: block;
  padding: 6px 8px;
  margin: 1px 0px;
  &.active {
    background: var(--bg-base);
  }
  &:hover {
    background: var(--bg-base);
  }
  .menu-icon {
    margin-right: 8px;
    color: var(--color-text-3) !important;
  }
`;
const StyledMenu = styled.div`
  height: calc(100vh - 128px);
  overflow-y: auto;
  padding: 12px 0px 12px 0px;
  padding-left: 4px;
  font-size: 12px;
`;

export default StyledMenu;
