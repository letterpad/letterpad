import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { Feature } from "./_feature";

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
      <Feature />
    </>
  );
};

export default EditableTable;
