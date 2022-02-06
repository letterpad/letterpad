import usePost from "@/components/post/usePost";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { InputUpdatePost } from "@/__generated__/__types__";
import { Editor } from "@tinymce/tinymce-react";
import { Dispatch, SetStateAction } from "react";

export type PostContextType = {
  updating: boolean;
  loading: boolean;
  setUpdating: Dispatch<SetStateAction<boolean>>;
  fileExplorerOpen: boolean;
  post: PostWithAuthorAndTagsFragment | undefined;
  setPost: ReturnType<typeof usePost>["setPost"];
  helpers: Editor["editor"] | undefined;
  setHelpers: (helpers: Editor["editor"]) => void;
  error: string;
  setPostAttribute: (attrs: Omit<InputUpdatePost, "id">) => Promise<void>;
  onFileExplorerClose: () => void;
  onMediaBrowse: () => void;
};
