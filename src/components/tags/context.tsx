import { useMemo, useState, createContext } from "react";
import { useContext } from "react";
import { TagRow, TagsContextType } from "@/components/tags/types";
import { useTagsQuery } from "@/__generated__/queries/queries.graphql";
import {
  useDeleteTagsMutation,
  useUpdateTagsMutation,
} from "@/__generated__/queries/mutations.graphql";
import { useEffect } from "react";
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

export const TagsProvider: React.FC = ({ children }) => {
  const { loading, data } = useTagsQuery({
    fetchPolicy: "network-only",
  });
  const [updateTagsMutation] = useUpdateTagsMutation();
  const [deleteTagsMutation] = useDeleteTagsMutation();
  const [tags, setTags] = useState<TagRow[]>([]);

  useEffect(() => {
    if (!loading && data?.tags.__typename === "TagsNode") {
      setTags(
        data.tags.rows.map((item) => ({
          ...item,
          key: item.name,
          posts: item.posts?.__typename === "PostsNode" ? item.posts.count : 0,
        })),
      );
    }
  }, [loading]);

  const deleteTag = async (key: React.Key) => {
    const tagToDelete = [...tags].filter((item) => item.key === key);
    if (tagToDelete.length > 0) {
      await deleteTagsMutation({ variables: { name: tagToDelete[0].name } });
    }
    setTags([...tags].filter((item) => item.key !== key));
  };

  const saveTag = async (row: TagRow) => {
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
  };

  const addTag = () => {
    const newData: TagRow = {
      key: tags.length + 2,
      name: `new-tag-${tags.length}`,
      posts: 0,
      slug: `new-tag-${tags.length}`,
    };
    setTags([...tags, newData]);
  };

  const context: TagsContextType<typeof updateTagsMutation, typeof deleteTag> =
    {
      loading,
      tags,
      deleteTag,
      addTag,
      updateTagsMutation,
      saveTag,
      headers: getHeaders(tags, deleteTag),
    };

  return useMemo(() => {
    return (
      <TagsContext.Provider value={context}>{children}</TagsContext.Provider>
    );
  }, [context.tags, loading]);
};

export const useTagsContext = () => useContext(TagsContext);
