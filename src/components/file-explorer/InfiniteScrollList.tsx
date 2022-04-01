import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";

interface IInfiniteScrollListProps {
  data: any;
  count: number;
  loadMore: () => void;
}

const InfiniteScrollList = ({
  data,
  count,
  loadMore,
}: IInfiniteScrollListProps) => {
  return (
    <>
      <div className="grid">
        <InfiniteScroll
          height={400}
          dataLength={data.length}
          next={loadMore}
          hasMore={data.length < count}
          loader={null}
        >
          <div className="image-grid">{data}</div>
        </InfiniteScroll>
      </div>
      <style jsx>{`
        .image-grid {
          display: grid;
          grid-gap: 10px;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          /* grid-auto-rows: minmax(50px, auto); */
        }
      `}</style>
    </>
  );
};

export default InfiniteScrollList;
