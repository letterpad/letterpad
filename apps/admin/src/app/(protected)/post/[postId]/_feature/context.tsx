import { Editor } from "@tinymce/tinymce-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useGetSettings } from "@/app/(protected)/settings/_feature/api.client";

import { PostContextType } from "./types";

export const PostContext = createContext<PostContextType>(
  {} as PostContextType
);

export const PostProvider: React.FC<{
  children: ReactNode;
  addSettings?: boolean;
}> = ({ children, addSettings = true }) => {
  const { data: settings } = useGetSettings(addSettings);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [helpers, setHelpers] = useState<Editor["editor"]>();
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
      saving,
      setSaving,
    }),
    [
      fileExplorerOpen,
      settings,
      helpers,
      setHelpers,
      onMediaBrowse,
      onFileExplorerClose,
      saving,
      setSaving,
    ]
  );

  return useMemo(() => {
    return (
      <PostContext.Provider value={context}>{children}</PostContext.Provider>
    );
  }, [context, children]);
};

export const usePostContext = () => useContext(PostContext);
