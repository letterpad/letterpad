import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

import {
  HomeQueryQuery,
  useDomainQuery,
  useMediaQuery,
  usePostsQuery,
} from "../graphql/queries/queries.graphql";

interface Props {
  me?: HomeQueryQuery["me"];
  settings?: HomeQueryQuery["settings"];
  stats?: HomeQueryQuery["stats"];
  posts?: ReturnType<typeof usePostsQuery>;
  media?: ReturnType<typeof useMediaQuery>;
  domain?: ReturnType<typeof useDomainQuery>;
  session?: ReturnType<typeof useSession>["data"] | null;
}
export const DataContext = createContext<Props>({});

export const useDataProvider = () => {
  return useContext(DataContext);
};
