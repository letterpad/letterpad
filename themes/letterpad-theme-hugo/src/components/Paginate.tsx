import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Link } from "react-router-dom";

const Wrapper = styled.div`
  text-align: center;
  ul {
    display: inline-block;
    padding: 0;
    margin: 28px 0;

    li {
      display: inline;
      a {
        border-right: 1px solid var(--color-border);
        background: var(--bg-sections);
        padding: 8px 14px;
        font-weight: 400;
        &.active,
        &:hover {
          background: var(--color-accent);
          color: #fff;
        }
      }
      &:first-child a {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child a {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-right: none;
      }
    }
  }
`;

const Paginate = ({ count, limit, page, changePage }: any) => {
  const pages = Array.from(Array(Math.floor(count / limit)));
  if (pages.length === 1) return null;
  const pageItems = pages.map((_, i) => {
    const num = i + 1;
    const active = num === page ? "active" : "";
    return (
      <li key={i}>
        <Link className={active} onClick={e => changePage(e, num)} to="#">
          {num}
        </Link>
      </li>
    );
  });
  return (
    <Wrapper className="pagination-wrapper">
      <ul className="pagination">{pageItems}</ul>
    </Wrapper>
  );
};
export default Paginate;

// import React from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const Paginate = ({ count, match, limit }) => {
//   const totalPages = Array.from(Array(Math.ceil(count / limit || 6) - 1));
//   if (totalPages.length == 1) return null;
//   const pages = totalPages.map((_, i) => {
//     const page = i + 1;
//     let to = "/";

//     if (match.path == "/") {
//       to = "/home/page/" + page;
//     } else if (
//       match.path == "/posts/:slug" ||
//       match.path == "/posts/:slug/page/:page_no"
//     ) {
//       to = "/posts/" + match.params.slug + "/page/" + page;
//     }
//     let selected = parseInt(match.params.page_no) === page ? "active" : "";

//     if (!match.params.page_no && page == 1) {
//       selected = "active";
//     }

//     return (
//       <li key={i}>
//         <Link className={selected} to={to}>
//           {page}
//         </Link>
//       </li>
//     );
//   });

//   return <ul className="pagination">{pages}</ul>;
// };

// Paginate.propTypes = {
//   count: PropTypes.number,
//   page: PropTypes.number,
//   limit: PropTypes.number,
//   match: PropTypes.object,
// };
// export default Paginate;
