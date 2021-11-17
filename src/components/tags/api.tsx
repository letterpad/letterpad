import { initializeApollo } from "@/graphql/apollo";
import {
  DeleteTagsDocument,
  DeleteTagsMutation,
  DeleteTagsMutationVariables,
  UpdateTagsDocument,
  UpdateTagsMutation,
  UpdateTagsMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import {
  TagsDocument,
  TagsQuery,
  TagsQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { TagRow } from "./types";

export async function fetchTags() {
  const apolloClient = await initializeApollo();

  const tags = await apolloClient.query<TagsQuery, TagsQueryVariables>({
    query: TagsDocument,
  });
  if (tags.data.tags?.__typename === "TagsNode") {
    const data = tags.data.tags.rows.map((item) => {
      const count =
        item.posts?.__typename === "PostsNode" ? item.posts.count : 0;
      return { ...item, posts: count };
    });
    return {
      props: {
        data,
        error: "",
      },
    };
  } else {
    return {
      props: {
        data: [],
        error:
          tags.data.tags?.__typename === "TagsError"
            ? tags.data.tags.message
            : "",
      },
    };
  }
}

export async function deleteTagApi(id) {
  const apolloClient = await initializeApollo();

  const tags = await apolloClient.mutate<
    DeleteTagsMutation,
    DeleteTagsMutationVariables
  >({
    mutation: DeleteTagsDocument,
    variables: {
      id,
    },
  });

  return tags.data?.deleteTags;
}

export const saveTags = async (row: TagRow, oldData: TagRow[]) => {
  const newData = [...oldData];
  const index = newData.findIndex((item) => row.key === item.key);
  const item = newData[index];
  newData.splice(index, 1, {
    ...item,
    ...row,
  });

  const { name, id, desc, slug } = row;
  const client = await initializeApollo();
  await client.mutate<UpdateTagsMutation, UpdateTagsMutationVariables>({
    mutation: UpdateTagsDocument,
    variables: {
      data: { name, id, desc, slug },
    },
  });
  return newData;
};
