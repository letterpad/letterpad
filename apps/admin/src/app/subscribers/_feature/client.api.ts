import { useSubscribersQuery } from "letterpad-graphql/dist/hooks";

export const useGetSubscribers = () => {
  const [{ data, fetching, error }, refetch] = useSubscribersQuery();

  return { data, fetching, error, refetch };
};
