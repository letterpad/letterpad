import { PageHeader } from "antd";
import { Alert } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { getSession } from "next-auth/react";

import Loading from "@/components/loading";
import { Content as ProfileContent } from "@/components/profile/content";

import { useMeQuery } from "@/__generated__/queries/queries.graphql";

function Profile({ readOnly }: { readOnly: boolean }) {
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
        {readOnly && (
          <Alert
            message="This section is read only. You will be able to make changes, but they wont be saved."
            type="warning"
          />
        )}
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
