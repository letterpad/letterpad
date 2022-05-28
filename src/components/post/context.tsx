import { useMemo, useState, createContext, useCallback } from "react";

import { Setting } from "@/__generated__/__types__";
import { useContext } from "react";
import { PostContextType } from "@/components/post/types";
import { Editor } from "@tinymce/tinymce-react";

export const PostContext = createContext<Partial<PostContextType>>({});

export const PostProvider: React.FC<{
  settings: Setting;
}> = ({ children, settings }) => {
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [helpers, setHelpers] = useState<Editor["editor"]>();

  //updatePostDraftAttributes

  const onMediaBrowse = useCallback(() => setFileExplorerOpen(true), []);

  const onFileExplorerClose = useCallback(() => setFileExplorerOpen(false), []);

  const context: PostContextType = useMemo(
    () => ({
      fileExplorerOpen,
      settings,
      helpers,
      setHelpers,
      onMediaBrowse,
      onFileExplorerClose,
    }),
    [
      fileExplorerOpen,
      settings,
      helpers,
      setHelpers,
      onMediaBrowse,
      onFileExplorerClose,
    ],
  );

  return useMemo(() => {
    return (
      <PostContext.Provider value={context}>{children}</PostContext.Provider>
    );
  }, [context, children]);
};

export const usePostContext = () => useContext(PostContext);
