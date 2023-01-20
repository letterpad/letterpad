import { Media } from "@/__generated__/__types__";
import {
  DeleteMediaDocument,
  DeleteMediaMutation,
  DeleteMediaMutationVariables,
  UpdateMediaDocument,
  UpdateMediaMutation,
  UpdateMediaMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import {
  MediaDocument,
  StatsDocument,
  StatsQuery,
} from "@/__generated__/queries/queries.graphql";

import { apolloBrowserClient } from "./graphql/apolloBrowserClient";

export const deleteImageAPI = async (img: Media) => {
  const response = await apolloBrowserClient.mutate<
    DeleteMediaMutation,
    DeleteMediaMutationVariables
  >({
    mutation: DeleteMediaDocument,
    variables: {
      ids: [img.id],
    },
    update: (cache) => {
      const mediaList = cache.readQuery({
        query: MediaDocument,
        variables: { filters: {} },
      });
      //@ts-ignore
      const rows = mediaList.media.rows.filter((item) => item.id !== img.id);
      //@ts-ignore
      const count = mediaList.media.count - 1;

      //@ts-ignore
      const newMediaList = { media: { ...mediaList.media, rows, count } };

      cache.writeQuery({
        query: MediaDocument,
        variables: { filters: {} },
        data: newMediaList,
      });

      const stats = cache.readQuery<StatsQuery>({
        query: StatsDocument,
      });

      cache.writeQuery({
        query: StatsDocument,
        data: { stats: { ...stats?.stats, media: count } },
      });
    },
  });
  return response;
};

export const updateImageAPI = async (img: Media) => {
  if (!img) return;

  const response = await apolloBrowserClient.mutate<
    UpdateMediaMutation,
    UpdateMediaMutationVariables
  >({
    mutation: UpdateMediaDocument,
    variables: {
      data: {
        id: img.id,
        description: img.description,
        name: img.name,
      },
    },
  });
  const update = response.data?.updateMedia;

  return update;
};
