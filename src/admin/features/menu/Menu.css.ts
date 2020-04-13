import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledHeading = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: bold;
  margin: 16px 0px 8px 8px;
  letter-spacing: 1px;
`;
export const MenuItem = styled.li`
  a {
    padding: 12px 0px;
  }
`;

export const StyledLink = styled(Link)`
  display: block;
  &.active:before,
  &:hover:before {
    content: ".";
    position: absolute;
    margin-left: -16px;
    font-size: 2rem;
    line-height: 0rem;
  }
  /* &:hover {
    font-weight: 600;
    color: var(--color-hover-primary);
  } */
  .menu-icon {
    margin-right: 8px;
    color: var(--color-text-3) !important;
  }
  display: flex;
  justify-content: space-between;
  .stats-item {
    color: var(--color-muted);
    font-weight: 400;
  }
`;
const StyledMenu = styled.div`
  overflow-y: auto;
  padding: 28px 40px;
`;

export default StyledMenu;
