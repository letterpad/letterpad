import usePost from "@/components/post/usePost";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { InputUpdatePost } from "@/__generated__/__types__";
import { EditorHelpers } from "letterpad-editor";
import { Dispatch, SetStateAction } from "react";

export type PostContextType = {
  updating: boolean;
  loading: boolean;
  setUpdating: Dispatch<SetStateAction<boolean>>;
  fileExplorerOpen: boolean;
  post: PostWithAuthorAndTagsFragment | undefined;
  setPost: ReturnType<typeof usePost>["setPost"];
  helpers: EditorHelpers | undefined;
  setHelpers: (helpers: EditorHelpers) => void;
  error: string;
  setPostAttribute: (attrs: Omit<InputUpdatePost, "id">) => Promise<void>;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
};
