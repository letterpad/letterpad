import { useDomainQuery } from "@/__generated__/queries/queries.graphql";
import { Alert, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import Loading from "@/components/loading";
import { NewDomain } from "@/components/domain/new-domain";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = ({ readOnly }) => {
  const { data, loading } = useDomainQuery();
  console.log(data);
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
        {readOnly && (
          <Alert
            message="This section is read only. You will be able to make changes, but they wont be saved."
            type="warning"
          />
        )}
        <div className="site-layout-background" style={{ padding: 24 }}>
          {loading && <Loading />}
          {/* {data?.domain.__typename === "Domain" && data.domain.mapped && (
            <Mapped />
          )} */}
          {data?.domain.__typename === "DomainNotFound" && <NewDomain />}
          {data?.domain.__typename === "Domain" && !data.domain.mapped && (
            <NewDomain name={data.domain.name} />
          )}
        </div>
      </Content>
    </>
  );
};

export default DomainMapping;
