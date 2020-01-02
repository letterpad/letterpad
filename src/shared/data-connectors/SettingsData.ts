import { graphql } from "@apollo/react-hoc";
import { QUERY_SETTINGS } from "../queries/Queries";

const SettingsData = graphql(QUERY_SETTINGS, {
  props: ({ data: { loading, settings, error } }: any) => {
    const data = {};
    if (settings) {
      settings.forEach(setting => {
        data[setting.option] = setting;
      });
    }
    return {
      settings: {
        data,
        loading,
        error,
      },
    };
  },
});

export default SettingsData;
