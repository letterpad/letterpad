import styled from "styled-components";

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  .left-block {
    display: flex;
    align-items: center;
  }
  .right-block {
    display: flex;
    align-items: center;
  }
`;

export const Layout = styled.div`
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
