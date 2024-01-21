import InfiniteScroll from "react-infinite-scroll-component";

interface IInfiniteScrollListProps {
  data: any;
  count: number;
  loadMore: () => void;
}

export const InfiniteScrollList = ({
  data,
  count,
  loadMore,
}: IInfiniteScrollListProps) => {
  return (
      <div className="grid">
        <InfiniteScroll
          height={400}
          dataLength={data.length}
          next={loadMore}
          hasMore={data.length < count}
          loader={null}
        >
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {data}
          </div>
        </InfiniteScroll>
      </div>
  ) as JSX.Element;
};
