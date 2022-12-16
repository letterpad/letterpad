import { ChangeEvent, useState } from "react";

import { useDomainMutation } from "@/hooks/useCreateOrUpdateDomain";

import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";
import { Message } from "@/components_v2/message";

import { useRemoveDomainMutation } from "@/__generated__/queries/mutations.graphql";

import { CopyToClipboard } from "../clipboard";

export const NewDomain: React.FC<{
  name?: string;
  mapped?: boolean;
  ssl?: boolean;
}> = ({ name, mapped = false }) => {
  const [domain, setDomain] = useState("");

  const [removeDomain] = useRemoveDomainMutation();
  const { updateLocalState, createUpdateDomain } = useDomainMutation();

  const next = async (values) => {
    const result = await createUpdateDomain({ name: values.domain });
    if (result.data?.createOrUpdateDomain.ok) {
      if (result.data?.createOrUpdateDomain.message)
        Message().success({
          content: result.data?.createOrUpdateDomain.message,
        });
    }
  };

  const removeMapping = async () => {
    await removeDomain();
    updateLocalState({ mapped: false, ssl: false });
  };

  const changeDomainName = (e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  return (
    <>
      <div className="m-auto flex max-w-2xl flex-auto flex-col gap-8 px-4">
        <div className="flex flex-1 items-center ">
          <Input
            label="Map Network Address"
            id="map_id"
            value="letterpad.network"
            help="Copy this Network Address and set it as a A record in your Domain under DNS configuration"
          />
          <CopyToClipboard elementId="map_id" />
        </div>
        <div className="rounded-md bg-red-200 p-4 font-medium text-red-800 shadow-md dark:bg-gray-800 dark:text-red-400">
          Proceed with the below step only after you have mapped the Network
          Address with your domain, otherwise domain verification will fail.
        </div>
        <Input
          label="Domain Name"
          value={domain}
          placeholder="e.g. example.com, blog.example.com"
          help="(without http://, https:// and www)"
          onChange={changeDomainName}
          disabled={mapped}
        />
        {!mapped && (
          <Buttonv2 variant="primary" type="submit">
            Map my domain
          </Buttonv2>
        )}

        {mapped && (
          <Buttonv2 variant="danger" onClick={removeMapping}>
            Remove Mapping
          </Buttonv2>
        )}
      </div>
    </>
  );
};
