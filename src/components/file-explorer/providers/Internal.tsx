import React, { useEffect, useState } from "react";
import { initializeApollo } from "@/graphql/apollo";
import {
  MediaQuery,
  MediaQueryVariables,
} from "@/graphql/queries/queries.graphql";
import { MediaDocument } from "@/__generated__/queries/queries.graphql";
import { Media } from "@/__generated__/type-defs.graphqls";
import InfiniteScrollList from "../InfiniteScrollList";

interface IProps {
  renderer: (items: Media[]) => JSX.Element[];
}

const InternalMedia: React.FC<IProps> = ({ renderer }) => {
  const client = initializeApollo();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Media[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  let mounted = false;
  useEffect(() => {
    mounted = true;
    fetchInternalMedia();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchInternalMedia = async (page = 1) => {
    const result = await client.query<MediaQuery, MediaQueryVariables>({
      query: MediaDocument,
      variables: {
        filters: {
          page,
          // authorId: 1,
        },
      },
    });

    const images = {
      rows: result.data.media.rows,
      count: result.data.media.count,
    };
    if (mounted) {
      setData([...data, ...images.rows]);
      setTotalCount(images.count);
    }
  };

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
