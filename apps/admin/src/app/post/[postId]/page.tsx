"use client";
import { Post, PostProvider } from "@/components/post";

import { Setting } from "@/__generated__/__types__";

import { useMeAndSettingsContext } from "../../../components/providers/settings";

function EditPost() {
  const { settings } = useMeAndSettingsContext();
  if (!settings) return null;
  return (
    <PostProvider settings={settings}>
      <Post />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </PostProvider>
  );
}

EditPost.noLayout = true;
export default EditPost;
