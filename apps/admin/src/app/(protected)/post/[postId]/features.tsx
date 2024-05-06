"use client";

import { PostProvider } from "./_feature/context";
import { Feature } from "./_feature/feature";
import { TinyMceStyleChange } from "../../../tinymceThemeChange";

export function EditPost() {
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
