import { graphql } from "@apollo/react-hoc";
import { QUERY_THEMES } from "../../shared/queries/Queries";

export default graphql(QUERY_THEMES, {
  options: (props: any) => {
    let name = props.name;
    if (props.settings) {
      name = props.settings.data.theme.value;
    }
    return {
      variables: {
        name,
      },
    };
  },
  props: ({ data: { loading, themeSettings } }: any) => {
    let newSettings = {};
    if (themeSettings && themeSettings.length > 0) {
      const userValues = JSON.parse(themeSettings[0].value);
      const settings = JSON.parse(themeSettings[0].settings);

      settings.map(setting => {
        if (userValues[setting.name]) {
          setting.defaultValue = userValues[setting.name];
        }
        newSettings[setting.name] = userValues[setting.name];
      });
    }
    return {
      themeSettings: newSettings,
      themeSettingsLoading: loading,
    };
  },
});
