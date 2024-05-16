import { Children, FC, ReactNode } from "react";
import { InfiniteScrollList } from "ui/dist/index.mjs";

interface Props {
  totalCount: number;
  loadMore: () => void;
  jsxElements: ReactNode;
}
export const Gallery: FC<Props> = ({ totalCount, loadMore, jsxElements }) => {
  const count = Children.count(jsxElements);
  return (
    <InfiniteScrollList
      data={jsxElements}
      count={totalCount}
      loadMore={loadMore}
      height={count < 25 ? 400 : "calc(100vh - 278px)"}
    />
  );
};
