import {
  Media,
  MediaDocument,
  MediaQuery,
  MediaQueryVariables,
} from "letterpad-graphql";
import { useCallback, useEffect, useState } from "react";

import { client } from "../../../lib/urqlClient";

export const useInternal = () => {
  const [data, setData] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInternalMedia = useCallback(async (page = 1) => {
    setLoading(true);
    const images = await fetchMedia(page);
    setLoading(false);
    setData((prevData) => {
      return [...prevData, ...images.rows];
    });
    setTotalCount(images.count);
  }, []);

  useEffect(() => {
    fetchInternalMedia();
  }, [fetchInternalMedia]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchInternalMedia(nextPage);
  };

  return {
    data,
    totalCount,
    error,
    loading,
    loadMore,
  };
};

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
