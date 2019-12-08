import { graphql } from "@apollo/react-hoc";
import { GET_OPTIONS } from "../queries/Queries";

const SettingsData = graphql(GET_OPTIONS, {
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
