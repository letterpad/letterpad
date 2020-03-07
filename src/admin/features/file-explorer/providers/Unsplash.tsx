import React, { useEffect, useState } from "react";

import InfiniteScrollList from "../InfiniteScrollList";
import Input from "../../../components/input";
import { Media } from "../../../../__generated__/gqlTypes";
import config from "../../../../config";

interface IProps {
  renderer: (items: Media[]) => JSX.Element[];
}
const url = config.BASE_NAME + "/admin/unsplash";

const Unsplash: React.FC<IProps> = ({ renderer }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<JSX.Element[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUnsplashMedia(page, "docs");
  }, []);
  const fetchUnsplashMedia = async (page = 1, query: string) => {
    const endpoint = url + "/page/" + page + "/query/" + query;

    const { rows, count }: { rows: any; count: number } = await fetch(
      endpoint,
    ).then(data => {
      return data.json();
    });

    const images = {
      rows: rows.map(item => {
        return {
          id: item.id,
          url: item.urls.regular,
          description: item.description,
          createdAt: item.created_at,
        };
      }),
      count,
    };

    const jsxElements = renderer(images.rows);
    setData([...data, ...jsxElements]);
    setTotalCount(images.count);
  };

  const onKeyUp = async e => {
    const search = e.target.value.trim();
    if (search.length > 0) {
      if (e.keyCode === 13) {
        return fetchUnsplashMedia(page, query);
      }
      return setQuery(search);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUnsplashMedia(nextPage, query);
  };

  return (
    <div>
      {/* <Input onKeyUp={onKeyUp} placeholder="Enter a keyword to search images" /> */}
      <InfiniteScrollList data={data} count={totalCount} loadMore={loadMore} />
    </div>
  );
};

export default Unsplash;
