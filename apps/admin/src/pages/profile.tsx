import Head from "next/head";
import { Content, PageHeader } from "ui";

import Loading from "@/components/loading";
import { Content as ProfileContent } from "@/components/profile/content";

import { useMeQuery } from "@/__generated__/queries/queries.graphql";

function Profile({ me }) {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageHeader className="site-page-header" title="Profile">
        <span className="help-text">
          Set up your profile. This will be used by themes to add author
          information for your blog posts.
        </span>
      </PageHeader>
      <Content>
        {me?.__typename === "Author" && <ProfileContent data={me} />}
      </Content>
    </>
  );
}

export default Profile;
