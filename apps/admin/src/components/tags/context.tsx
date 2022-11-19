import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { TagRow, TagsContextType } from "@/components/tags/types";

import {
  useDeleteTagsMutation,
  useUpdateTagsMutation,
} from "@/__generated__/queries/mutations.graphql";
import { useTagsQuery } from "@/__generated__/queries/queries.graphql";

import { getHeaders } from "./headers";

export const TagsContext = createContext<Partial<TagsContextType<any, any>>>({
  loading: true,
  tags: [],
  updateTagsMutation: () => null,
  deleteTag: () => null,
  addTag: () => null,
  saveTag: () => null,
  headers: [],
});

export const TagsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { loading, data } = useTagsQuery({
    fetchPolicy: "network-only",
  });
  const [updateTagsMutation] = useUpdateTagsMutation();
  const [deleteTagsMutation] = useDeleteTagsMutation();
  const [tags, setTags] = useState<TagRow[]>([]);

  const computedTags = useMemo(
    () => (data?.tags.__typename === "TagsNode" ? data.tags.rows : []),
    [data],
  );

  useEffect(() => {
    if (!loading) {
      setTags(
        computedTags.map((item) => ({
          ...item,
          key: item.name,
          posts: item.posts?.__typename === "PostsNode" ? item.posts.count : 0,
        })),
      );
    }
  }, [computedTags, loading]);

  const deleteTag = useCallback(
    async (key: React.Key) => {
      const tagToDelete = [...tags].filter((item) => item.key === key);
      if (tagToDelete.length > 0) {
        await deleteTagsMutation({ variables: { name: tagToDelete[0].name } });
      }
      setTags([...tags].filter((item) => item.key !== key));
    },
    [deleteTagsMutation, tags],
  );

  const saveTag = useCallback(
    async (row: TagRow) => {
      const newData = [...tags];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });

      const { name, slug } = row;
      await updateTagsMutation({
        variables: {
          data: { name, slug, old_name: item.name },
        },
      });
      if (newData) setTags(newData);
    },
    [tags, updateTagsMutation],
  );

  const addTag = useCallback(() => {
    const newData: TagRow = {
      key: tags.length + 2,
      name: `new-tag-${tags.length}`,
      posts: 0,
      slug: `new-tag-${tags.length}`,
    };
    setTags([...tags, newData]);
  }, [tags]);

  const context: TagsContextType<typeof updateTagsMutation, typeof deleteTag> =
    useMemo(
      () => ({
        loading,
        tags,
        deleteTag,
        addTag,
        updateTagsMutation,
        saveTag,
        headers: getHeaders(tags, deleteTag),
      }),
      [addTag, deleteTag, loading, saveTag, tags, updateTagsMutation],
    );

  return useMemo(() => {
    return (
      <TagsContext.Provider value={context}>{children}</TagsContext.Provider>
    );
  }, [children, context]);
};

export const useTagsContext = () => useContext(TagsContext);
