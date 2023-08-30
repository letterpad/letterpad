import { Media } from "@/__generated__/__types__";
import {
  DeleteMediaDocument,
  UpdateMediaDocument,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} from "@/__generated__/src/graphql/queries/mutations.graphql";

export const useDeleteImage = () => {
  const [, deleteMedia] = useDeleteMediaMutation();

  return {
    deleteMedia: (id: number) => deleteMedia({ ids: [id] }),
  };
};

export const useUpdateImage = () => {
  const [, updateMedia] = useUpdateMediaMutation();

  return {
    updateMedia,
  };
};
