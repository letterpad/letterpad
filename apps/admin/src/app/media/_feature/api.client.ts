import {
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} from "letterpad-graphql/dist/hooks";

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
