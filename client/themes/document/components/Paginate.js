import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "../../../../config";
import InfiniteScroll from "react-infinite-scroller";

const Paginate = ({ data, count, page, loadMore }) => {
    const limit = config.itemsPerPage;
    const pages = Array.from(Array(Math.ceil(count / limit)));

    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={page < pages.length}
            loader={<div className="loader1">Loading ...</div>}
        >
            {data}
        </InfiniteScroll>
    );
};

Paginate.propTypes = {
    count: PropTypes.number,
    page: PropTypes.number,
    changePage: PropTypes.func
};
export default Paginate;
