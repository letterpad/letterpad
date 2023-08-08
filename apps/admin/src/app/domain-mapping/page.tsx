"use client";
import Head from "next/head";
import { AiFillCheckCircle } from "react-icons/ai";
import { Button, Content, Message, PageHeader } from "ui";

import { NewDomain } from "@/components/domain/new-domain";
import Loading from "@/components/loading";

import { Domain, DomainVerification } from "@/__generated__/__types__";
import {
  DomainQuery,
  useDomainQuery,
} from "@/__generated__/queries/queries.graphql";
import { useRemoveDomainMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";

import { MapDomain } from "../../components/domain/map-domain";
import { MapSubDomain } from "../../components/domain/map-subdomain";
import { MappedDomain } from "../../components/domain/mapped-domain";
import { VerifyDomain } from "../../components/domain/verify-domain";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  const { data, loading, refetch } = useDomainQuery();
  // const certs = useDomainCertsQuery({ pollInterval: 10000 });
  const [removeDomain] = useRemoveDomainMutation();

  const removeMapping = async () => {
    const result = await removeDomain();
    Message().success({
      content: result.data?.removeDomain.message!,
    });
    refetch();
  };

  const validate = (
    <Button className="mt-4" onClick={() => refetch()} variant="primary">
      Validate this change
    </Button>
  );

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
        <div className="flex max-w-4xl flex-auto flex-col gap-1">
          {!hasDomain(data) && <NewDomain refetch={refetch} />}

          {hasDomain(data) && (
            <div className="flex justify-end">
              <Button variant="danger" size="small" onClick={removeMapping}>
                Remove
              </Button>
            </div>
          )}
          {data?.domain.__typename === "Domain" && data.domain.verification && (
            <VerifyDomain
              verification={getVerificaionData(data.domain.verification)}
              validate={validate}
            />
          )}

          {isVerified(data) &&
            !isMapped(data) &&
            isSubdomain(getDomainData(data).name) && (
              <MapSubDomain
                domain={getDomainData(data).name}
                validate={validate}
              />
            )}

          {isVerified(data) &&
            !isMapped(data) &&
            !isSubdomain(getDomainData(data).name) && (
              <MapDomain
                domain={getDomainData(data).name}
                validate={validate}
              />
            )}

          {isVerified(data) && isMapped(data) && (
            <MappedDomain {...getDomainData(data)} />
          )}

          <div className="mt-4 flex gap-8">
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

function isSubdomain(input: string): boolean {
  // Regular expression to match valid subdomain names
  // Test examples
  // console.log(isSubdomain("example.com")); // false (domain)
  // console.log(isSubdomain("subdomain.example.com")); // true (subdomain)
  // console.log(isSubdomain("subdomain.example.co.in")); // true (subdomain)
  // console.log(isSubdomain("invalid..subdomain")); // false (invalid)
  // console.log(isSubdomain("not.a.subdomain.")); // false (invalid)
  const subdomainPattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  return subdomainPattern.test(input);
}
