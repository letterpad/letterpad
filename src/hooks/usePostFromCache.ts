import { Post } from "@/__generated__/__types__";
import { PostDocument } from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

export const usePostFromCache = (postId: number) => {
  const postData = apolloBrowserClient.readQuery({
    query: PostDocument,
    variables: { filters: { id: postId } },
  });

  if (postData) return postData.post as Post;
  else return postData as null;
};
