import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";

interface IInfiniteScrollListProps {
  data: any;
  count: number;
  loadMore: () => void;
  className?: string;
}

export const InfiniteScrollList = ({
  data,
  count,
  loadMore,
  className
}: IInfiniteScrollListProps) => {
  return (
    <div className={classNames("grid overflow-y-scroll", className)} id="scrollableDiv">
      <InfiniteScroll
        className={className}
        dataLength={data.length}
        next={loadMore}
        hasMore={data.length < count}
        loader={null}
      >
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6 h-full">
          {data}
        </div>
      </InfiniteScroll>
    </div>
  ) as JSX.Element;
};
