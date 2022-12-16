import Head from "next/head";

import { TagsProvider } from "@/components/tags/context";
import TagsTable from "@/components/tags/tags-table";
import { PageHeader } from "@/components_v2/page-header";

const EditableTable = () => {
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
      <TagsProvider>
        <TagsTable />
      </TagsProvider>
    </>
  );
};

export default EditableTable;
