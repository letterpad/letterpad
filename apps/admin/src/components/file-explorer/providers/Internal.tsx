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
  const [totalCount, setTotalCount] = useState(0);
  const mounted = useRef(false);

  const fetchInternalMedia = useCallback(async (page = 1) => {
    const images = await fetchMedia(page);
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

  if (data.length === 0) {
    return <p>You do not have any images in your gallery.</p>;
  }

  const jsxElements = renderer(data);

  return (
    <div>
      <InfiniteScrollList
        data={jsxElements}
        count={totalCount}
        loadMore={loadMore}
      />
    </div>
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
