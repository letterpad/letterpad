import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Content, PageHeader } from "ui";

import { NewDomain } from "@/components/domain/new-domain";
import Loading from "@/components/loading";

import { useDomainQuery } from "@/__generated__/queries/queries.graphql";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  const { data, loading, refetch } = useDomainQuery();
  const [domain, setDomain] = useState("");
  const [domainList, setDomainList] = useState([]);

  const [disabled, setDisabled] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (domain.length == 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [domain]);

  useEffect(() => {
    if (adding) setDisabled(true);
  }, [adding]);

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
        <Button variant="primary" onClick={() => refetch()}>
          Refresh
        </Button>
        {data?.domain.__typename === "DomainNotFound" && <NewDomain />}
        {data?.domain.__typename === "Domain" && <NewDomain {...data.domain} />}
      </Content>
    </>
  );
};

export default DomainMapping;
