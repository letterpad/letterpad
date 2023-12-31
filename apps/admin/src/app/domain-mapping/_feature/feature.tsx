"use client";

import { AiFillCheckCircle } from "react-icons/ai";
import { Button, Message } from "ui";

import { Domain, DomainVerification } from "@/__generated__/__types__";
import { useRemoveDomainMutation } from "@/__generated__/src/graphql/queries/mutations.graphql";
import {
  DomainQuery,
  useDomainQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { MapDomain } from "./components/map-domain";
import { MapSubDomain } from "./components/map-subdomain";
import { MappedDomain } from "./components/mapped-domain";
import { NewDomain } from "./components/new-domain";
import { VerifyDomain } from "./components/verify-domain";

export const Feature = () => {
  const [{ data }, refetch] = useDomainQuery();
  const [{}, removeDomain] = useRemoveDomainMutation();

  const removeMapping = async () => {
    const result = await removeDomain({});
    Message().success({
      content: result.data?.removeDomain.message!,
    });
    document.location.reload();
  };

  const validate = (
    <Button className="mt-4" onClick={() => document.location.reload()} variant="primary">
      Validate this change
    </Button>
  );

  return (
    <>
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
          <MapSubDomain domain={getDomainData(data).name} validate={validate} />
        )}

      {isVerified(data) &&
        !isMapped(data) &&
        !isSubdomain(getDomainData(data).name) && (
          <MapDomain domain={getDomainData(data).name} validate={validate} />
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
    </>
  );
};

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

function isSubdomain(url: string): boolean {
  // IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
  url = url.replace(new RegExp(/^\s+/), ""); // START
  url = url.replace(new RegExp(/\s+$/), ""); // END

  // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
  url = url.replace(new RegExp(/\\/g), "/");

  // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
  url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");

  // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
  url = url.replace(new RegExp(/^www\./i), "");

  // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
  url = url.replace(new RegExp(/\/(.*)/), "");

  // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
  if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
    url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");

    // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
  } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
    url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
  }

  // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
  var subDomain = url.match(new RegExp(/\./g)) ? true : false;

  return subDomain;
}
