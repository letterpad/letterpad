import { PageHeader } from "antd";
import CustomLayout from "@/components/layouts/Layout";
import withAuthCheck from "../hoc/withAuth";
import Head from "next/head";
import { TagsProvider } from "@/components/tags/context";
import Component from "@/components/tags/component";
import { getSession } from "next-auth/react";

const EditableTable = ({ readOnly }: { readOnly: boolean }) => {
  return (
    <>
      <Head>
        <title>Tags</title>
      </Head>
      <PageHeader className="site-page-header" title="Tags">
        Tags are essentially categories. They allow you to group posts together
        using whatever tag you want and then use these tags to setup your
        navigation menu.
      </PageHeader>
      <TagsProvider readOnly={readOnly}>
        <Component />
      </TagsProvider>
    </>
  );
};

const EditableTableWithAuth = withAuthCheck(EditableTable);
EditableTableWithAuth.layout = CustomLayout;
export default EditableTableWithAuth;

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
