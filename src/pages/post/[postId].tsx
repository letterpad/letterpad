import withAuthCheck from "@/hoc/withAuth";

import { PostProvider } from "@/components/post/context";

import dynamic from "next/dynamic";

const PostWithNoSSR = dynamic(
  () => import("@/components/post/components/post"),
  {
    ssr: false,
  },
);

function Main() {
  return (
    <PostProvider>
      <PostWithNoSSR />
    </PostProvider>
  );
}

export default withAuthCheck(Main);
