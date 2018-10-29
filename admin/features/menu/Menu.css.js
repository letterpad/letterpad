import styled from "styled-components";

const StyledMenu = styled.div`
  height: calc(100vh - 128px);
  overflow-y: auto;

  font-weight: 300;
  letter-spacing: 1px;

  .nav.nav-list {
    font-size: 13px;
    width: 96%;

    li.active a {
      color: rgba(var(--color-accent));
      font-weight: 500;
    }
    > li a {
      text-decoration: none;
      display: block;
      padding: 10px 15px;
      cursor: pointer;
      color: var(--color-menu-link);
      span {
        font-size: 11px;
        letter-spacing: 0.5;
        font-weight: 400;
        text-transform: uppercase;
      }
    }
    > li > a {
      color: var(--color-menu-link);
      padding-left: 13px !important;
    }
    > li a:hover {
      border-left: 0px solid var(--color-accent);
    }
    .menu-icon {
      margin-top: 4px;
      margin-right: 8px;
      color: inherit;
      transition: color 0.2s linear;
    }
    li.has-sub {
      > a:first-child::after {
        content: " + ";
        margin-left: 100px;
        position: absolute;
      }
      &.open > a::after {
        content: " - ";
        margin-left: 100px;
        position: absolute;
      }
      /* Second level folder*/
      > ul.nav.nav-list {
        background: var(--bg-base);
        display: none;
        &.in {
          display: block;
        }
        /* Third level files*/
        > ul.nav.nav-list {
          margin-left: 32px;
          background: var(--bg-base);
          display: none;
          &.in {
            display: block;
          }
        }
      }
    }
    > li > a {
      &:hover {
        background: transparent;
        color: rgba(var(--color-accent));
      }
      &:focus {
        background: transparent;
        border-color: transparent;
      }
    }
    .open > a {
      background: transparent;
      &:hover {
        background: transparent;
      }
      &:focus {
        background: transparent;
      }
    }
  }
`;

export default StyledMenu;
