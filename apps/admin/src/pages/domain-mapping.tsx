import Head from "next/head";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { Button, Content, PageHeader } from "ui";

import { NewDomain } from "@/components/domain/new-domain";
import Loading from "@/components/loading";

import {
  DomainQuery,
  useDomainCertsQuery,
  useDomainQuery,
} from "@/__generated__/queries/queries.graphql";

import { MapDomain } from "../components/domain/map-domain";
import { MappedDomain } from "../components/domain/mapped-domain";
import { VerifyDomain } from "../components/domain/verify-domain";
import { Domain, DomainVerification } from "../../__generated__/__types__";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  const { data, loading, refetch } = useDomainQuery();
  // const certs = useDomainCertsQuery({ pollInterval: 10000 });

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
        <div className="flex max-w-4xl flex-auto flex-col gap-4">
          {!hasDomain(data) && <NewDomain />}

          {data?.domain.__typename === "Domain" && data.domain.verification && (
            <VerifyDomain
              verification={getVerificaionData(data.domain.verification)}
            />
          )}

          {isVerified(data) && !isMapped(data) && (
            <MapDomain domain={getDomainData(data).name} />
          )}

          {isVerified(data) && isMapped(data) && (
            <MappedDomain {...getDomainData(data)} />
          )}

          <div className="flex gap-8">
            {isVerified(data) && (
              <div className="flex items-center gap-2">
                <AiFillCheckCircle className="text-green-500" size={20} />
                Valid Configuration
              </div>
            )}
            {isMapped(data) && (
              <div className="flex items-center gap-2">
                <AiFillCheckCircle className="text-green-500" size={20} />
                Assigned to Letterpad
              </div>
            )}
          </div>
        </div>
      </Content>
    </>
  );
};

export default DomainMapping;

function hasDomain(data?: DomainQuery) {
  return data?.domain.__typename === "Domain";
}

function isVerified(data?: DomainQuery): boolean {
  return data?.domain.__typename === "Domain" && !data.domain.verification;
}

function isMapped(data?: DomainQuery) {
  return data?.domain.__typename === "Domain" && data.domain.configured;
}

function getVerificaionData(verification?: DomainVerification[]) {
  return verification?.filter((v) => v.type === "TXT").pop();
}
function getDomainData(data?: DomainQuery) {
  return (data?.domain.__typename === "Domain" && data.domain) as Domain;
}
