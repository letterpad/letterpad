import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Paginate = ({ count, page, changePage }) => {
    const limit = 20;
    const pages = Array.from(Array(Math.ceil(count / limit)));

    const pageItems = pages.map((_, i) => {
        const num = i + 1;
        const active = num === page ? "active" : "";
        return (
            <li key={i}>
                <Link
                    className={active}
                    onClick={e => changePage(e, num)}
                    to="#"
                >
                    {num}
                </Link>
            </li>
        );
    });

    return <ul className="pagination">{pageItems}</ul>;
};

Paginate.propTypes = {
    count: PropTypes.number,
    page: PropTypes.number,
    changePage: PropTypes.func
};

export default Paginate;
