import withAuthCheck from "@/hoc/withAuth";

import { PostProvider } from "@/components/post/context";
import Post from "@/components/post/components/post";
import { getSession } from "next-auth/react";

function Main({ readOnly }: { readOnly: boolean }) {
  return (
    <PostProvider readOnly={readOnly}>
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      readOnly:
        process.env.READ_ONLY === "true" &&
        session?.user?.email === "demo@demo.com",
    },
  };
}
