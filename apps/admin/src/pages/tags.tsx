import { PageHeader } from "antd";
import Head from "next/head";
import { getSession } from "next-auth/react";

import { TagsProvider } from "@/components/tags/context";
import TagsTable from "@/components/tags/tags-table";

const EditableTable = ({ readOnly }: { readOnly: boolean }) => {
  return (
    <>
      <Head>
        <title>Tags</title>
      </Head>
      <PageHeader className="site-page-header" title="Tags">
        <span className="help-text">
          Tags are essentially categories. They allow you to group posts
          together using whatever tag you want and then use these tags to setup
          your navigation menu.
        </span>
      </PageHeader>
      <TagsProvider readOnly={readOnly}>
        <TagsTable />
      </TagsProvider>
    </>
  );
};

export default EditableTable;

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
