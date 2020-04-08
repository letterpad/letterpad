import { LayoutOptions } from "./index";
import styled from "styled-components";

const StyledToolbar = styled.div`
  color: var(--color-text-3);
`;

interface ILayoutProps {
  selected: LayoutOptions;
}

export const Layout = styled.div<ILayoutProps>`
  .${p => p.selected} {
    color: var(--color-accent);
  }
  width: 36px;
  display: flex;
  justify-content: space-between;
  .fa {
    cursor: pointer;
  }
  margin-right: 20px;
`;

export default StyledToolbar;
