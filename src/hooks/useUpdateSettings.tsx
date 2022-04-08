import { useCallback } from "react";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { debounce } from "@/shared/utils";
import { useUpdateOptionsMutation } from "@/__generated__/queries/mutations.graphql";
import { SettingsDocument } from "@/__generated__/queries/queries.graphql";
import { SettingInputType } from "@/__generated__/__types__";
import { EventAction, track } from "@/track";
import { message } from "antd";

const key = "settings";

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

    if (res.data?.updateOptions?.__typename === "SettingError") {
      const error = res.data?.updateOptions?.message;
      if (error) {
        message.error({ key, content: error, duration: 10 });
      }
    }
  }

  const d = useCallback(debounce(updateSettings, 500), []);

  const debounceUpdateSettings = (data: SettingInputType) => {
    updateLocalState(data);
    d(data);
  };

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
    debounceUpdateSettings,
    updateLocalState,
  };
};