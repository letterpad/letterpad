"use client";

import { PostProvider } from "@/components/post";
import { useMeAndSettingsContext } from "@/components/providers/settings";

import { Feature } from "../../../features/post/feature";

function EditPost() {
  const { settings } = useMeAndSettingsContext();

  return (
    <PostProvider settings={settings!}>
      <Feature />
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
