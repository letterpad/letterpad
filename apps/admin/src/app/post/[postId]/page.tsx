"use client";
import { Post, PostProvider } from "@/components/post";

import { Setting } from "@/__generated__/__types__";

import { useDataProvider } from "../../../context/DataProvider";

function EditPost() {
  const { settings } = useDataProvider();
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
