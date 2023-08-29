import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Feature } from "@/features/domain-mapping";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  return (
    <>
      <Head>
        <title>Domain Mapping</title>
      </Head>
      <PageHeader className="site-page-header" title="Domain Mapping">
        <span className="help-text">
          Link your custom domain with Letterpad
        </span>
      </PageHeader>

      <Content>
        <div className="flex max-w-4xl flex-auto flex-col gap-1">
          <Feature />
        </div>
      </Content>
    </>
  );
};

export default DomainMapping;
