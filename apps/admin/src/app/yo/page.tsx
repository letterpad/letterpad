"use client";
import { useQuery } from "urql";

import {
  MeDocument,
  MeQueryResult,
} from "@/__generated__/src/graphql/queries/queries.graphql";

// import { getClient } from "../../lib/urql";

const Page = () => {
  // const d = await getClient().query<MeQueryResult>(MeDocument, {});

  const d = useQuery({ query: MeDocument });
  return (
    <div>
      <pre>{JSON.stringify(d[0].data, null, 2)}</pre>
    </div>
  );
};
export default Page;
