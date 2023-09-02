import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Feature } from "./_feature/feature";

function Profile() {
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
        <Feature />
      </Content>
    </>
  );
}

export default Profile;
