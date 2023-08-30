import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Feature } from "../../features/subscribers";

function Subscribers() {
  return (
    <>
      <Head>
        <title>Subscribers</title>
      </Head>
      <PageHeader className="site-page-header" title="Subscribers">
        <span className="help-text">
          Here you will find all the users subscribed to your blog.
        </span>
      </PageHeader>
      <Content>
        <Feature />
      </Content>
    </>
  );
}

export default Subscribers;
