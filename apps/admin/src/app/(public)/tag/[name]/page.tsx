"use client";

import { usePostsQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

const Tag = ({ params }: { params: { name: string } }) => {
  const [{ data }] = usePostsQuery({
    variables: {
      filters: {
        tagSlug: params.name,
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log(data);
  return (
    <>
      {/* <Feature /> */}
      {JSON.stringify(data)}
    </>
  );
};

export default Tag;
