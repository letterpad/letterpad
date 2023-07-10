import { ChangeEvent, useState } from "react";
import { Button, Input, Message } from "ui";

import { DomainVerification } from "@/__generated__/__types__";
import {
  useAddDomainMutation,
  useRemoveDomainMutation,
} from "@/__generated__/queries/mutations.graphql";

import { CopyToClipboard } from "../clipboard";

export const NewDomain: React.FC<{
  name?: string;
  mapped?: boolean;
  ssl?: boolean;
  verification?: DomainVerification[];
  configured?: boolean;
}> = ({ name, mapped = false, verification, configured }) => {
  const [domain, setDomain] = useState(name);

  const [removeDomain] = useRemoveDomainMutation();
  const [addDomainMutation, { data, loading, error }] = useAddDomainMutation();

  const removeMapping = async () => {
    const result = await removeDomain();
    Message().success({
      content: result.data?.removeDomain.message!,
    });
    setDomain("");
  };

  const changeDomainName = (e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const checkDomainVerification = async () => {
    //
  };

  const addDomain = async () => {
    if (domain) {
      const res = await addDomainMutation({ variables: { domain } });
      if (res?.data?.addDomain.__typename === "Domain") {
        setDomain("");
        Message().success({
          content: "Domain added successfully",
          duration: 3,
        });
      } else if (res?.data?.addDomain.__typename === "DomainError") {
        Message().error({
          content: res?.data?.addDomain.message,
          duration: 3,
        });
      }
    }
  };

  const txtVerification = verification?.filter((v) => v.type === "TXT").pop();

  return (
    <>
      <div className="m-auto flex max-w-4xl flex-auto flex-col gap-8 px-4">
        Domain mapping is a two step process. First you need to verify your
        domain using a TXT record and then map it with a CNAME record.
        <div className="flex flex-1 items-center gap-2">
          <Input
            label="Add Domain"
            value={domain}
            placeholder="e.g. example.com, blog.example.com"
            help="(without http://, https:// and www)"
            onChange={changeDomainName}
            disabled={mapped}
          />
          <Button variant="primary" onClick={addDomain} disabled={loading}>
            Add
          </Button>
        </div>
        {txtVerification && (
          <div>
            Please add the below TXT record in your Domain under DNS
            configuration
            <div
              className="mt-4 flex items-center gap-4 rounded-md bg-gray-200 p-4 font-medium text-gray-800 shadow-sm
             dark:bg-gray-800 dark:text-gray-400"
            >
              <div className="flex flex-col gap-4">
                <span className="font-bold text-black dark:text-white">
                  Type
                </span>
                <code className="text-sm">TXT</code>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-black dark:text-white">
                  Name
                </span>
                <code className="text-sm">
                  {txtVerification.domain.split(".")[0]}
                </code>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-black dark:text-white">
                  Value
                </span>
                <code className="text-sm" id="txt">
                  {txtVerification.value}
                </code>
              </div>
              <CopyToClipboard elementId="txt" />
            </div>
          </div>
        )}
        {!configured && (
          <div>
            Please add the below CNAME record in your Domain under DNS
            configuration to map your domain with Letterpad
            <div
              className="mt-4 flex items-center justify-between gap-4 rounded-md bg-gray-200 p-4 font-medium text-gray-800
             shadow-sm dark:bg-gray-800  dark:text-gray-400"
            >
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-black dark:text-white">
                    Type
                  </span>
                  <code className="text-sm">CNAME</code>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-black dark:text-white">
                    Name
                  </span>
                  <code className="text-sm">{domain?.split(".")[0]}</code>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-black dark:text-white">
                    Value
                  </span>
                  <code className="text-sm" id="txt">
                    cname.vercel-dns.com
                  </code>
                </div>
              </div>
              <CopyToClipboard elementId="txt" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
