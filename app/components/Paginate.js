import React from "react";
import { Link } from "react-router";

const Paginate = ({ count, page, changePage }) => {
    const limit = 3;
    const pages = Array.from(Array(Math.ceil(count / limit)));

    const pageItems = pages.map((_, i) => {
        let num = i + 1;
        let active = num == page ? "active" : "";
        return (
            <li>
                <Link
                    key={i}
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

export default Paginate;
