import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import styled from "styled-components";

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
    <Container>
      <InfiniteScroll
        height={400}
        dataLength={data.length}
        next={loadMore}
        hasMore={data.length < count}
        loader={
          <img
            src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
            alt="loading"
          />
        }
      >
        <div className="image-grid">{data}</div>
      </InfiniteScroll>
    </Container>
  );
};

export default InfiniteScrollList;

const Container = styled.div`
  .image-grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-auto-rows: minmax(50px, auto);

    .image-item:nth-child(5n) {
      grid-column-end: span 2;
    }

    img {
      display: flex;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
