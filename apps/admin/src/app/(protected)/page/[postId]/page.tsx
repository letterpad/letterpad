"use client";

import "ui/css/editor.css";

import { PostProvider } from "@/app/(protected)/post/[postId]/_feature/context";
import { Feature } from "@/app/(protected)/post/[postId]/_feature/feature";

import { TinyMceStyleChange } from "../../../tinymceThemeChange";

function EditPost() {
  return (
    <PostProvider>
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
      <TinyMceStyleChange />
    </PostProvider>
  );
}

export default EditPost;
