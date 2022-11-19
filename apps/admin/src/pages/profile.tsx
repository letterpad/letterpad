import { PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";

import Loading from "@/components/loading";
import { Content as ProfileContent } from "@/components/profile/content";

import { useMeQuery } from "@/__generated__/queries/queries.graphql";

function Profile() {
  const { data, loading } = useMeQuery({
    variables: {},
  });

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
        {loading && <Loading />}
        {data?.me?.__typename === "Author" && (
          <div className="site-layout-background" style={{ padding: 24 }}>
            <ProfileContent data={data.me} />
          </div>
        )}
      </Content>
    </>
  );
}

export default Profile;
