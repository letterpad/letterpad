"use client";

import { Post, PostProvider } from "@/components/post";

import { useMeAndSettingsContext } from "../../../components/providers/settings";

function EditPost() {
  const { settings } = useMeAndSettingsContext();

  return (
    <PostProvider settings={settings!}>
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

export default EditPost;
