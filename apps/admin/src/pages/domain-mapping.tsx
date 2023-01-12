import Head from "next/head";
import { PageHeader } from "ui";

import { NewDomain } from "@/components/domain/new-domain";
import Loading from "@/components/loading";
import { Content } from "@/components_v2/content";

import { useDomainQuery } from "@/__generated__/queries/queries.graphql";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  const { data, loading } = useDomainQuery();
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
        {loading && <Loading />}
        {data?.domain.__typename === "DomainNotFound" && <NewDomain />}
        {data?.domain.__typename === "Domain" && <NewDomain {...data.domain} />}
      </Content>
    </>
  );
};

export default DomainMapping;
