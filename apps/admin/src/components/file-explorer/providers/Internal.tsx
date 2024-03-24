import {
  Media,
  MediaDocument,
  MediaQuery,
  MediaQueryVariables,
} from "letterpad-graphql";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InfiniteScrollList } from "ui";

import { client } from "@/lib/urqlClient";

interface IProps {
  renderer: (items: Media[]) => JSX.Element[];
}

const InternalMedia: React.FC<IProps> = ({ renderer }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Media[]>([]);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const mounted = useRef(false);

  const fetchInternalMedia = useCallback(async (page = 1) => {
    setFetching(true);
    const images = await fetchMedia(page);
    setFetching(false);
    if (mounted.current) {
      setData((prevData) => {
        return [...prevData, ...images.rows];
      });
      setTotalCount(images.count);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchInternalMedia();

    return () => {
      mounted.current = false;
    };
  }, [fetchInternalMedia]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchInternalMedia(nextPage);
  };

  if (fetching) {
    return <div className="h-[60vh]">Loading...</div>;
  }
  if (data.length === 0) {
    return (
      <p className="h-[60vh]">You do not have any images in your gallery.</p>
    );
  }

  const jsxElements = renderer(data);

  return (
    <InfiniteScrollList
      data={jsxElements}
      count={totalCount}
      loadMore={loadMore}
      className="h-[60vh]"
    />
  );
};

export default InternalMedia;

const fetchMedia = async (page: number) => {
  const { data } = await client.query<MediaQuery, MediaQueryVariables>(
    MediaDocument,
    { filters: { page } },
    { requestPolicy: "network-only" }
  );
  const media = data?.media.__typename === "MediaNode" ? data.media : undefined;
  const images = {
    rows: media?.rows ?? [],
    count: media?.count ?? 0,
  };
  return images;
};
