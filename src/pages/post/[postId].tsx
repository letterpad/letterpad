import { Setting } from "@/__generated__/__types__";
import { PostProvider } from "@/components/post/context";
import Post from "@/components/post/components/post";

function EditPost({ settings }: { readOnly: boolean; settings: Setting }) {
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
