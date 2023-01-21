import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Input, Message, Modal } from "ui";

import { TagRow, TagsContextType } from "@/components/tags/types";

import {
  useDeleteTagsMutation,
  useUpdateTagsMutation,
} from "@/__generated__/queries/mutations.graphql";
import {
  usePostsQuery,
  useStatsQuery,
  useTagsQuery,
} from "@/__generated__/queries/queries.graphql";

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
  const [tags, setTags] = useState<TagRow[]>([]);
  const [editTagId, setEditTagId] = useState<React.Key | null>(null);
  const postsQuery = usePostsQuery({ skip: true });
  const statsQuery = useStatsQuery({ skip: true });

  const [updateTagsMutation] = useUpdateTagsMutation();
  const [deleteTagsMutation] = useDeleteTagsMutation();

  const computedTags = useMemo(
    () => (data?.tags.__typename === "TagsNode" ? data.tags.rows : []),
    [data]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      setTags(
        computedTags.map((item) => ({
          ...item,
          key: item.name,
          posts: item.posts?.__typename === "PostsNode" ? item.posts.count : 0,
        }))
      );
    }
  }, [computedTags, loading]);

  const deleteTag = useCallback(
    async (key: React.Key) => {
      const tagToDelete = [...tags].filter((item) => item.key === key);
      if (tagToDelete.length > 0) {
        await deleteTagsMutation({
          updateQueries: {
            Tags: (prev) => {
              return {
                ...prev,
                tags: {
                  ...prev.tags,
                  rows: prev.tags.rows.filter((tag) => tag.name !== key),
                },
              };
            },
          },
          variables: { name: tagToDelete[0].name },
        });
        postsQuery.refetch();
        statsQuery.refetch();
      }
    },
    [deleteTagsMutation, postsQuery, statsQuery, tags]
  );

  const editTag = useCallback(async (key: React.Key) => {
    setEditTagId(key);
  }, []);

  const saveTag = useCallback(
    async (row: TagRow) => {
      if (row.name.length === 0) {
        return Message().error({ content: "Tag name cannot be empty!" });
      }
      const isDuplicate = tags.filter((item) => item.name === row.name).pop();
      if (isDuplicate) {
        return Message().error({ content: "Tag name already exists!" });
      }

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
        updateQueries: {
          Tags: (prev) => {
            return {
              ...prev,
              tags: {
                ...prev.tags,
                rows: newData,
              },
            };
          },
        },
      });
      postsQuery.refetch();
      setEditTagId(null);
    },
    [tags, updateTagsMutation, postsQuery]
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
        headers: getHeaders({ tags, deleteTag, editTag }),
      }),
      [addTag, deleteTag, editTag, loading, saveTag, tags, updateTagsMutation]
    );

  const onSave = () => {
    if (tagToBeEdited)
      saveTag({ ...tagToBeEdited, name: inputRef.current?.value ?? "" });
  };

  const tagToBeEdited = tags.filter((item) => item.key === editTagId).pop();
  return (
    <TagsContext.Provider value={context}>
      {children}
      <Modal
        toggle={() => setEditTagId(null)}
        show={!!editTagId}
        header={`Editing tag: ${tagToBeEdited?.name}`}
        footer={[
          <Button
            key="close"
            variant="ghost"
            onClick={() => setEditTagId(null)}
            size="normal"
          >
            Cancel
          </Button>,
          <Button key="save" variant="primary" onClick={onSave} size="normal">
            Save
          </Button>,
        ]}
      >
        <Input
          label="Rename Tag"
          defaultValue={tagToBeEdited?.name}
          ref={inputRef}
          onEnter={onSave}
        />
      </Modal>
    </TagsContext.Provider>
  );
};

export const useTagsContext = () => useContext(TagsContext);
