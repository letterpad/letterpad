import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

const InfiniteScrollList = ({ data, count, loadMore }) => {
    return (
        <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={data.length < count}
            loader={
                <div className="loader1" key={0}>
                    Loading ...
                </div>
            }
        >
            {data}
        </InfiniteScroll>
    );
};

InfiniteScrollList.propTypes = {
    count: PropTypes.number,
    data: PropTypes.array.isRequired,
    loadMore: PropTypes.func.isRequired
};

export default InfiniteScrollList;
