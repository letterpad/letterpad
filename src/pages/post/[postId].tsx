import withAuthCheck from "@/hoc/withAuth";
import { Setting } from "@/__generated__/__types__";
import { PostProvider } from "@/components/post/context";
import Post from "@/components/post/components/post";
import { getSession } from "next-auth/react";

function EditPost({
  readOnly,
  settings,
}: {
  readOnly: boolean;
  settings: Setting;
}) {
  return (
    <PostProvider readOnly={readOnly} settings={settings}>
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

export default withAuthCheck(EditPost);

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
