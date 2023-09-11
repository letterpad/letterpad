import { Editor } from "@tinymce/tinymce-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { PostContextType } from "./types";
import { useGetSettings } from "../../../settings/_feature/api.client";

export const PostContext = createContext<PostContextType>(
  {} as PostContextType
);

export const PostProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { data: settings } = useGetSettings();
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [helpers, setHelpers] = useState<Editor["editor"]>();
  const [version, setVersion] = useState("");
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
      version,
      setVersion,
    }),
    [
      fileExplorerOpen,
      settings,
      helpers,
      setHelpers,
      onMediaBrowse,
      onFileExplorerClose,
      version,
      setVersion,
    ]
  );

  return useMemo(() => {
    return (
      <PostContext.Provider value={context}>{children}</PostContext.Provider>
    );
  }, [context, children]);
};

export const usePostContext = () => useContext(PostContext);
