import withAuthCheck from "@/hoc/withAuth";

import { PostProvider } from "@/components/post/context";
import Post from "@/components/post/components/post";

function Main() {
  return (
    <PostProvider>
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

export default withAuthCheck(Main);
