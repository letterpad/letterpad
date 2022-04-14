import { useCallback } from "react";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { debounce } from "@/shared/utils";
import { useUpdateAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import {
  MeDocument,
  SettingsDocument,
} from "@/__generated__/queries/queries.graphql";
import { InputAuthor } from "@/__generated__/__types__";
import { EventAction, track } from "@/track";
import { message, Modal } from "antd";
import { signOut } from "next-auth/react";

const key = "author";

export const useUpdateAuthor = (id: number) => {
  const [updateAuthorMutation, progress] = useUpdateAuthorMutation();

  async function updateAuthor(data: Omit<InputAuthor, "id">) {
    if (!data.password) {
      track({
        eventAction: EventAction.Change,
        eventCategory: "profile",
        eventLabel: Object.keys({ ...data, id }).join("-"),
      });
    }
    const meData = apolloBrowserClient.readQuery({
      query: MeDocument,
    });

    const res = await updateAuthorMutation({
      variables: {
        author: { ...data, id },
      },
      optimisticResponse: (cache) => {
        const data = { ...meData.me, ...cache.author };
        return {
          updateAuthor: {
            data: { ...data, social: { ...data.social, __typename: "Social" } },
            ok: true,
            errors: [],
          },
        };
      },
    });

    if (!res.data?.updateAuthor?.ok) {
      const error = res.data?.updateAuthor?.errors?.pop()?.message;
      if (error) {
        message.error({ key, content: error, duration: 10 });
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
      if (!data.email) return;
      Modal.success({
        title: "Email saved",
        okText: "Logout",
        closable: false,
        content: (
          <div>
            You have changed your email from <strong>{meData.me.email}</strong>{" "}
            to <strong>{data.email}</strong>. We have sent you an email to your
            new email address. Please verify your email and login.
          </div>
        ),
        onOk() {
          signOut({
            redirect: true,
          });
        },
      });
    }
  }

  const d = useCallback(debounce(updateAuthor, 500), []);

  const debounceUpdateAuthor = (data: Omit<InputAuthor, "id">) => {
    updateLocalState(data);
    d(data);
  };

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

  return { updateAuthor, progress, debounceUpdateAuthor, updateLocalState };
};
