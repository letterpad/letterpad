import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";

interface IInfiniteScrollListProps {
  data: any;
  count: number;
  loadMore: () => void;
  className?: string;
  height?: number | string;
}

export const InfiniteScrollList = ({
  data,
  count,
  loadMore,
  className,
  height
}: IInfiniteScrollListProps) => {
  return (
    <div className={classNames("grid", className)} id="scrollableDiv">
      <InfiniteScroll
        height={height}
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
      <style>
        {`
        .infinite-scroll-component  {
          transition: height 0.5s linear;
        }
      `}
      </style>
    </div>
  ) as JSX.Element;
};
