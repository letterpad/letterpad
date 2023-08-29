import { useState } from "react";
import { Message } from "ui";
import { useMutation, useQuery } from "urql";

import { InputAuthor } from "@/__generated__/__types__";
import {
  UpdateAuthorDocument,
  UpdateAuthorMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  StatsDocument,
  StatsQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { isAuthor, isPostsNode, isStats } from "../../utils/type-guards";

export const useUpdateAuthor = () => {
  const [{ data, fetching, error }, a] =
    useMutation<UpdateAuthorMutation["updateAuthor"]>(UpdateAuthorDocument);

  return {
    fetching,
    error,
    data: isAuthor(data) ? data : undefined,
    updateAuthor: async (change: InputAuthor) => {
      Message().loading({ content: "Updating, Please wait..." });
      const result = await a({
        author: {
          ...change,
        },
      });
      Message().success({ content: "Saved", duration: 100 });
      return result;
    },
  };
};

export const useGetPosts = (variables) => {
  const [{ fetching, data, error }, refetch] = useQuery<PostsQuery>({
    query: PostsDocument,
    variables: {
      filters: variables,
    },
  });
  const postsNode = isPostsNode(data?.posts) ? data?.posts.rows : [];
  return {
    fetching,
    error,
    data: postsNode,
    refetch,
  };
};

export const useGetStats = () => {
  const [{ fetching, data, error }, refetch] = useQuery<StatsQuery>({
    query: StatsDocument,
  });

  return {
    fetching,
    error,
    data: isStats(data?.stats) ? data?.stats : undefined,
    refetch,
  };
};
