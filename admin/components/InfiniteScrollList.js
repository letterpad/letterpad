import React from "react";
import PropTypes from "prop-types";
import config from "../../config";
import InfiniteScroll from "react-infinite-scroller";

const InfiniteScrollList = ({ data, count, page, loadMore }) => {
    const limit = config.itemsPerPage;

    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={data.length < count}
            loader={<div className="loader1">Loading ...</div>}
        >
            {data}
        </InfiniteScroll>
    );
};

InfiniteScrollList.propTypes = {
    count: PropTypes.number,
    page: PropTypes.number,
    changePage: PropTypes.func
};
export default InfiniteScrollList;
