import { useMemo, useState, createContext } from "react";

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

  const onMediaBrowse = () => setFileExplorerOpen(true);

  const onFileExplorerClose = () => setFileExplorerOpen(false);

  const context: PostContextType = {
    fileExplorerOpen,
    settings,
    helpers,
    setHelpers,
    onMediaBrowse,
    onFileExplorerClose,
  };

  return useMemo(() => {
    return (
      <PostContext.Provider value={context}>{children}</PostContext.Provider>
    );
  }, [context]);
};

export const usePostContext = () => useContext(PostContext);
