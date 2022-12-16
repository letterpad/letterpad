import { useCallback } from "react";

import { Message } from "@/components_v2/message";

import { SettingInputType } from "@/__generated__/__types__";
import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { SettingsDocument } from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { EventAction, track } from "@/track";

export const useUpdateSettings = () => {
  const [updateOption, progress] = useUpdateOptionsMutation();

  async function updateSettings(data: SettingInputType) {
    track({
      eventAction: EventAction.Change,
      eventCategory: "settings",
      eventLabel: Object.keys({ ...data }).join("-"),
    });

    const settingsData = apolloBrowserClient.readQuery({
      query: SettingsDocument,
    });

    const res = await updateOption({
      variables: {
        options: { ...data },
      },
      update: (cache, response) => {
        cache.writeQuery({
          query: SettingsDocument,
          data: {
            settings: {
              ...settingsData.settings,
              ...response.data?.updateOptions,
            },
          },
        });
      },
      optimisticResponse: (cache) => {
        return {
          updateOptions: {
            ...settingsData.settings,
            ...cache.options,
          },
        };
      },
    });

    if (res.data?.updateOptions?.__typename === "UnAuthorized") {
      const error = res.data?.updateOptions?.message;
      if (error) {
        Message().error({ content: error, duration: 10 });
      }
    }
  }

  const updateSettingsAPI = useCallback(
    async (data: SettingInputType) => {
      track({
        eventAction: EventAction.Change,
        eventCategory: "settings",
        eventLabel: Object.keys({ ...data }).join("-"),
      });
      await updateOption({
        variables: {
          options: { ...data },
        },
      });
    },
    [updateOption],
  );

  const updateLocalState = (data: SettingInputType) => {
    const settingsData = apolloBrowserClient.readQuery({
      query: SettingsDocument,
    });

    apolloBrowserClient.writeQuery({
      query: SettingsDocument,
      data: {
        settings: {
          ...settingsData.settings,
          ...data,
        },
      },
    });
  };

  return {
    updateSettings,
    progress,
    updateLocalState,
    updateSettingsAPI,
  };
};
