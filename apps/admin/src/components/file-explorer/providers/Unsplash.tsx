import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SearchInput } from "@/components_v2/input";

import { Media } from "@/__generated__/__types__";
import { basePath } from "@/constants";

import InfiniteScrollList from "../InfiniteScrollList";

interface IProps {
  renderer: (items: Media[]) => JSX.Element[];
}
const Unsplash: React.FC<IProps> = ({ renderer }) => {
  const url = (basePath + "/api/unsplash").replace("//api", "");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Media[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnsplashResponse = useCallback(
    ({ rows, count, error, page }: any) => {
      setLoading(false);
      if (error) {
        return setError(
          "Rate limit for Unsplash has exceeded for free version. Please try after sometime."
        );
      }
      if (rows.length === 0) {
        return setError("No images found.");
      }
      if (page === 1) {
        setData(rows);
      } else {
        setData([...data, ...rows]);
      }
      setTotalCount(count);
    },
    [data]
  );

  const searchUnsplash = useCallback(
    async (searchTerm, page = 1) => {
      if (!searchTerm || searchTerm.length === 0) {
        return setLoading(false);
      }
      setLoading(true);
      setPage(page);
      fetchUnsplashMedia(url, page, searchTerm)
        .then(handleUnsplashResponse)
        .catch((_e) => {
          setError(_e.message);
          setLoading(false);
        });
    },
    [handleUnsplashResponse, url]
  );

  const resetAll = () => {
    setError("");
    setLoading(false);
    setData([]);
  };

  const onSearchEnter = async (searchTerm) => {
    if (searchTerm && searchTerm.length > 0) {
      resetAll();
      setQuery(searchTerm);
      setPage(1);
      searchUnsplash(searchTerm);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchUnsplash(query === "" ? "random" : query, nextPage);
  };
  useEffect(() => {
    searchUnsplash("random");
  }, []);

  const jsxElements = useMemo(() => renderer(data), [data, renderer]);
  return (
    <div>
      <SearchInput
        value={query}
        enterButton="Search"
        data-testid="input-unsplash"
        onSearch={onSearchEnter}
        placeholder="Search high resolution photos from Unsplash"
        loading={loading}
      />

      <br />

      <span className="text-gray-700 dark:text-gray-200">{error}</span>
      <InfiniteScrollList
        data={jsxElements}
        count={totalCount}
        loadMore={loadMore}
      />
    </div>
  );
};

export default Unsplash;

const fetchUnsplashMedia = async (url: string, page: number, query: string) => {
  if (!query) return;
  // unsplash.com/page/1/query/forest
  const endpoint = url + "?page=" + page + "&query=" + query;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Umable to reach unsplash");
    const data = await response.json();
    const { rows, count } = data;

    const images = {
      rows: rows?.map((item) => {
        return {
          id: item.id,
          url: item.urls.regular,
          description: `Photo by <a href="${item.user.links.html}?utm_source=Letterpad Editor&utm_medium=referral">${item.user.name}</a> on <a href="https://unsplash.com/?utm_source=Letterpad Editor&utm_medium=referral">Unsplash</a>`,
          createdAt: item.created_at,
          width: item.width,
          height: item.height,
          download_location: item.links.download_location,
        };
      }),
      count,
      page,
    };
    return images;
  } catch (e: any) {
    throw new Error(e);
  }
};
