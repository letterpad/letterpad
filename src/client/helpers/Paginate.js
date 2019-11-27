import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Paginate = ({ count, match, limit }) => {
  const totalPages = Array.from(Array(Math.ceil(count / limit || 6)));
  if (totalPages.length === 1) return null;
  const pages = totalPages.map((_, i) => {
    const page = i + 1;
    let to = "/";

    if (match.path == "/") {
      to = "/home/page/" + page;
    } else if (
      match.path == "/posts/:slug" ||
      match.path == "/posts/:slug/page/:page_no"
    ) {
      to = "/posts/" + match.params.slug + "/page/" + page;
    } else if (
      match.path == "/category/:query" ||
      match.path == "/category/:query/page/:page_no"
    ) {
      to = "/category/" + match.params.query + "/page/" + page;
    } else if (
      match.path == "/tag/:query" ||
      match.path == "/tag/:query/page/:page_no"
    ) {
      to = "/tag/" + match.params.query + "/page/" + page;
    }
    let selected = parseInt(match.params.page_no) === page ? "active" : "";

    if (!match.params.page_no && page == 1) {
      selected = "active";
    }

    return (
      <li key={i}>
        <Link className={selected} to={to}>
          {page}
        </Link>
      </li>
    );
  });

  return <ul className="pagination">{pages}</ul>;
};

Paginate.propTypes = {
  count: PropTypes.number,
  match: PropTypes.object,
};
export default Paginate;
