import { QUERY_SETTINGS } from "../shared/queries/Queries";
import { SettingsQuery } from "./../__generated__/gqlTypes";
import apolloClient from "../shared/apolloClient";

const client = apolloClient(false, { ssrMode: true });

export const fetchSettings = async () => {
  // get the settings data. It contains information about the theme that we want to render.
  const settings = await client.query<SettingsQuery>({
    query: QUERY_SETTINGS,
    fetchPolicy: "network-only",
  });
  return settings.data.settings;
};
