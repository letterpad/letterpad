import styled from "styled-components";

const StyledHeader = styled.header`
  box-shadow: var(--box-shadow);
  position: fixed;
  width: 100%;
  z-index: 1;
  background: var(--bg-sections);
  padding-left: 12px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-side {
    display: flex;
  }
  .right-side {
    display: flex;
    margin-right: 20px;
    align-items: center;

    .view-site {
      margin-right: 10px;
      font-weight: 500;
      font-size: 12px;
    }
  }
  button.navbar-toggle {
    margin: 0px;
    background: transparent;
    border: 1px solid transparent;
    color: var(--color-base);
    display: none;
    margin-right: 8px;
    @media screen and (max-width: 998px) {
      display: block;
      cursor: pointer;
      z-index: 999;
      i {
        font-size: 20px;
      }
    }
  }
  .navbar-brand {
    font-weight: 600;
    font-size: 23px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .dropdown-menu {
    margin-left: -120px;
  }
`;

export default StyledHeader;
