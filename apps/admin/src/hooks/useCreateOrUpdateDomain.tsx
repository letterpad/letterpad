import { useCallback } from "react";
import { Message } from "ui";

import { InputDomain } from "@/__generated__/__types__";
import { useCreateOrUpdateDomainMutation } from "@/__generated__/queries/mutations.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { DomainDocument } from "@/graphql/queries/queries.graphql";
import { debounce } from "@/shared/utils";
import { EventAction, track } from "@/track";

export const useDomainMutation = () => {
  const [updateDomain, progress] = useCreateOrUpdateDomainMutation();

  async function createUpdateDomain(data: InputDomain) {
    track({
      eventAction: EventAction.Change,
      eventCategory: "domain",
      eventLabel: Object.keys({ ...data }).join("-"),
    });

    const res = await updateDomain({
      variables: {
        data,
      },
    });

    if (!res.data?.createOrUpdateDomain.ok) {
      const error = res.data?.createOrUpdateDomain?.message;
      if (error) {
        Message().error({ content: error, duration: 10 });
      }
    } else {
      updateLocalState({ mapped: true, ssl: true, name: data.name });
    }
    return res;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(debounce(createUpdateDomain, 500), []);

  const debounceUpdateDomain = (data: InputDomain) => {
    updateLocalState(data);
    run(data);
  };

  const updateLocalState = (data: InputDomain) => {
    const cache = apolloBrowserClient.readQuery({
      query: DomainDocument,
    });
    const domainData = {
      ...cache.domain,
      ...data,
    };

    apolloBrowserClient.writeQuery({
      query: DomainDocument,
      data: {
        domain: domainData,
      },
    });
  };

  return {
    createUpdateDomain,
    progress,
    debounceUpdateDomain,
    updateLocalState,
  };
};
