import React from "react";
import InfiniteScroll from "react-infinite-scroller";

interface IInfiniteScrollListProps {
  data: any;
  count: number;
  loadMore: (num: number) => void;
}

const InfiniteScrollList: React.FC<IInfiniteScrollListProps> = ({
  data,
  count,
  loadMore,
}) => {
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

export default InfiniteScrollList;
