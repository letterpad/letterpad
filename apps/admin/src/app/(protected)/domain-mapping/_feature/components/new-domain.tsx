import { useAddDomainMutation } from "letterpad-graphql/hooks";
import { ChangeEvent, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { Button, Input, Message } from "ui/dist/index.mjs";

import { useIsPaidAndNotTrialMember } from "@/hooks/useIsPaidMember";

const regex =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;
export const NewDomain = () => {
  const [domain, setDomain] = useState("");
  const isPaidMember = useIsPaidAndNotTrialMember();
  const [{ fetching: loading }, addDomain] = useAddDomainMutation();

  const changeDomainName = (e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const tryAddDomain = async () => {
    if (regex.test(domain) !== true) {
      Message().error({
        content: "Invalid domain",
        duration: 3,
      });
      return;
    }

    if (domain) {
      const res = await addDomain({ domain: domain });
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
      document.location.reload();
    }
  };

  return (
    <>
      <div className="flex max-w-4xl flex-auto flex-col gap-8">
        <div className="flex flex-1 items-end gap-2">
          <Input
            label="Add Domain or Sub Domain"
            value={domain}
            placeholder="e.g. example.com, blog.example.com"
            onChange={changeDomainName}
            disabled={!isPaidMember}
          />
          <Button
            variant="primary"
            onClick={tryAddDomain}
            disabled={loading || !domain || !isPaidMember}
            className="h-10"
          >
            Add
          </Button>
        </div>
      </div>

      <div
        className="flex items-start p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-gray-700 mt-10"
        role="alert"
      >
        <BsInfoCircleFill className="me-4 mt-1" />
        <span className="sr-only">Info</span>
        <div>
          <span className="font-extrabold block">Important!</span> Domain
          mapping is a two step process.
          <br />
          <br />
          1. Verify your domain using a <Bold>TXT record</Bold>
          <br />
          2. Add <Bold>CNAME record</Bold> if its a subdomain or{" "}
          <Bold>A record</Bold> if its an apex domain
        </div>
      </div>
    </>
  );
};

const Bold = ({ children }) => {
  return <strong>{children}</strong>;
};
