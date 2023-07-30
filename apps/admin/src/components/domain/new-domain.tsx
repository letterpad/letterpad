import { ChangeEvent, useState } from "react";
import { Button, Input, Message } from "ui";

import {
  useAddDomainMutation,
  useRemoveDomainMutation,
} from "@/__generated__/queries/mutations.graphql";

export const NewDomain = ({ refetch }) => {
  const [domain, setDomain] = useState("");

  const [addDomainMutation, { data, loading, error }] = useAddDomainMutation();

  const changeDomainName = (e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
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
      refetch();
    }
  };

  return (
    <>
      <div className="flex max-w-4xl flex-auto flex-col gap-8">
        Domain mapping is a two step process. First you need to verify your
        domain using a TXT record and then map it with a CNAME record.
        <div className="flex flex-1 items-end gap-2">
          <Input
            label="Add Domain"
            value={domain}
            placeholder="e.g. example.com, blog.example.com"
            onChange={changeDomainName}
          />
          <Button
            variant="primary"
            onClick={addDomain}
            disabled={loading}
            className="h-10"
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
};
