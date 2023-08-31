import {
  useSubscriberQuery,
  useSubscribersQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

export const useGetSubscribers = () => {
  const [{ data, fetching, error }, refetch] = useSubscribersQuery();

  return { data, fetching, error, refetch };
};
