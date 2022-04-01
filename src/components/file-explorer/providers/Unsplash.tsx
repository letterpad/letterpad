import React, { useEffect, useState } from "react";

import InfiniteScrollList from "../InfiniteScrollList";
import { Media } from "@/__generated__/__types__";
import { Button, Input } from "antd";
import { basePath } from "@/constants";

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

  useEffect(() => {
    searchUnsplash();
  }, [query, page]);

  function handleUnsplashResponse({ rows, count }: any) {
    if (rows.length === 0) {
      return setError("No images found.");
    }
    setData([...data, ...rows]);
    setTotalCount(count);
  }

  const searchUnsplash = async () => {
    setError("");
    if (query.length === 0) return;
    setLoading(true);
    fetchUnsplashMedia(url, page, query)
      .then(handleUnsplashResponse)
      .catch((_e) => {
        setError(_e.message);
        setLoading(false);
      });
  };

  const onKeyUp = async (e) => {
    const search = e.target.value.trim();
    if (search.length > 0) {
      if (e.keyCode === 13) {
        setQuery(search);
        setData([]);
      }
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const jsxElements = renderer(data);
  return (
    <div>
      <Input.Group compact>
        <Input
          data-testid="input-unsplash"
          onKeyUp={onKeyUp}
          placeholder="Search high resolution photos from Unsplash"
          autoFocus
          style={{ width: "calc(100% - 110px)" }}
        />
        <Button type="primary" loading={loading} onClick={searchUnsplash}>
          Search
        </Button>
      </Input.Group>

      <br />
      <br />
      {error}
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
          description: `Unsplash - ${item.user.name} | ${item.links.html}`,
          createdAt: item.created_at,
          width: item.width,
          height: item.height,
        };
      }),
      count,
    };
    return images;
  } catch (e) {
    throw new Error(e);
  }
};
