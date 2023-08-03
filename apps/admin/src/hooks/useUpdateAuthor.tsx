import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Message } from "ui";

import { InputAuthor } from "@/__generated__/__types__";
import { useUpdateAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import {
  MeDocument,
  SettingsDocument,
} from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { EventAction, track } from "@/track";

const key = "author";

export const useUpdateAuthor = (id: number, withTracking = true) => {
  const [updateAuthorMutation, progress] = useUpdateAuthorMutation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateAuthorAPI(data: Omit<InputAuthor, "id">) {
    if (!data.password && withTracking) {
      track({
        eventAction: EventAction.Change,
        eventCategory: "profile",
        eventLabel: Object.keys({ ...data, id }).join("-"),
      });
    }
    setLoading(true);
    const result = await updateAuthorMutation({
      variables: {
        author: { ...data, id },
      },
    });
    updateLocalState(data);
    setLoading(false);
    return result;
  }

  async function updateAuthor(data: Omit<InputAuthor, "id">) {
    if (!data.password && withTracking) {
      track({
        eventAction: EventAction.Change,
        eventCategory: "profile",
        eventLabel: Object.keys({ ...data, id }).join("-"),
      });
    }
    setLoading(true);
    const meData = apolloBrowserClient.readQuery({
      query: MeDocument,
    });

    const res = await updateAuthorMutation({
      variables: {
        author: { ...data, id },
      },
      optimisticResponse: (cache) => {
        const data = { ...(meData?.me ?? {}), ...cache.author };
        return {
          updateAuthor: {
            ...data,
            social: { ...data.social, __typename: "Social" },
          },
        };
      },
    });
    setLoading(false);
    if (res.data?.updateAuthor?.__typename !== "Author") {
      const a = res.data?.updateAuthor;

      if (
        a?.__typename === "Exception" ||
        a?.__typename === "Failed" ||
        a?.__typename === "NotFound" ||
        a?.__typename === "UnAuthorized"
      ) {
        Message().error({ content: a.message, duration: 10 });
      }
    } else {
      if (data.username) {
        const settingsData = apolloBrowserClient.readQuery({
          query: SettingsDocument,
        });

        let site_url = settingsData.site_url;

        if (site_url.includes(".letterpad.app")) {
          site_url = `https://${data.username}.letterpad.app`;
        }

        apolloBrowserClient.writeQuery({
          query: SettingsDocument,
          data: {
            settings: {
              ...settingsData.settings,
              site_url,
            },
          },
        });
      }

      if (data.email) {
        router
          .replace("/messages/email-changed?newEmail=" + data.email)
          .then(() => {
            signOut({
              redirect: false,
              callbackUrl: "/posts",
            });
          });
      }
    }
    return res;
  }

  const updateLocalState = (data: Omit<InputAuthor, "id">) => {
    const meData = apolloBrowserClient.readQuery({
      query: MeDocument,
    });
    const author = {
      ...meData.me,
      ...data,
    };

    apolloBrowserClient.writeQuery({
      query: MeDocument,
      data: {
        me: author,
      },
    });
  };

  return { updateAuthor, progress, updateAuthorAPI, updateLocalState, loading };
};
