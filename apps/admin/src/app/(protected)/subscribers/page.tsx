import { PageHeader } from "ui/dist/isomorphic.mjs";

import { Content } from "@/components/client-wrapper";

import { Feature } from "./_feature";

function Subscribers() {
  return (
    <>
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
