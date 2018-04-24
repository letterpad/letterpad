import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "config";
import InfiniteScroll from "react-infinite-scroller";

const Paginate = ({ data, count, page, loadMore, useWindow }) => {
    const limit = config.itemsPerPage;
    const pages = Array.from(Array(Math.ceil(count / limit)));
    if (typeof useWindow === "undefined") {
        useWindow = true;
    }
    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={page < pages.length - 1}
            useWindow={useWindow}
            loader={
                <div className="loader">
                    <i className="fa fa-circle-o-notch fa-spin" />
                </div>
            }
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
