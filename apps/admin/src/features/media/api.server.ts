import { getClient } from "@/lib/urql";

import { Media } from "@/__generated__/__types__";
import {
  DeleteMediaDocument,
  DeleteMediaMutationResult,
  UpdateMediaDocument,
  UpdateMediaMutationResult,
} from "@/__generated__/src/graphql/queries/mutations.graphql";

export const deleteImage = (id: number) => {
  return getClient().mutation<DeleteMediaMutationResult["data"]>(
    DeleteMediaDocument,
    {
      ids: [id],
    }
  );
};

export const updateImage = (img: Media) => {
  return getClient().mutation<UpdateMediaMutationResult["data"]>(
    UpdateMediaDocument,
    {
      data: {
        id: img.id,
        description: img.description,
        name: img.name,
      },
    }
  );
};
