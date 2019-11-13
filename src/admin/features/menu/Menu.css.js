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
    color: var(--color-accent) !important;
  }
`;
const StyledMenu = styled.div`
  height: calc(100vh - 128px);
  overflow-y: auto;
  padding: 12px 0px 12px 0px;
  padding-left: 4px;
  font-size: 12px;

  ul {
    /* padding: 12px 0px; */

    > li {
      /* padding: 8px 0px; */
    }
  }
`;

export default StyledMenu;

// font-weight: 500;
// letter-spacing: 1px;

// .nav.nav-list {
//   font-size: 13px;
//   width: 96%;

//   li.active a {
//     color: rgba(var(--color-accent));
//   }
//   > li a {
//     text-decoration: none;
//     display: block;
//     padding: 10px 15px;
//     cursor: pointer;
//     color: var(--color-menu-link);
//     span {
//       font-size: 11px;
//       letter-spacing: 0.5;

//       text-transform: uppercase;
//     }
//   }
//   > li > a {
//     color: var(--color-menu-link);
//     padding-left: 13px !important;
//   }
//   > li a:hover {
//     border-left: 0px solid var(--color-accent);
//   }
//   .menu-icon {
//     margin-top: 4px;
//     margin-right: 8px;
//     color: inherit;
//     transition: color 0.2s linear;
//   }
//   li.has-sub {
//     > a:first-child::after {
//       content: " + ";
//       margin-left: 100px;
//       position: absolute;
//     }
//     &.open > a::after {
//       content: " - ";
//       margin-left: 100px;
//       position: absolute;
//     }
//     /* Second level folder*/
//     > ul.nav.nav-list {
//       background: var(--base-shade-1);
//       display: none;
//       &.in {
//         display: block;
//       }
//       /* Third level files*/
//       > ul.nav.nav-list {
//         margin-left: 32px;
//         background: var(--base-shade-1);
//         display: none;
//         &.in {
//           display: block;
//         }
//       }
//     }
//   }
//   > li > a {
//     &:hover {
//       background: transparent;
//       color: rgba(var(--color-accent));
//     }
//     &:focus {
//       background: transparent;
//       border-color: transparent;
//     }
//   }
//   .open > a {
//     background: transparent;
//     &:hover {
//       background: transparent;
//     }
//     &:focus {
//       background: transparent;
//     }
//   }
// }
