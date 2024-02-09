"use client";
import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { usePostsQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

const Tag = ({ params }: { params: { name: string } }) => {
  const [{ data }] = usePostsQuery({
    variables: {
      filters: {
        tagSlug: params.name,
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log(data);
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
      {/* <Feature /> */}
      cdascasdcsadc
    </>
  );
};

export default Tag;
