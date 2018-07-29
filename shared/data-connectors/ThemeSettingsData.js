import { graphql } from "react-apollo";
import { THEME_SETTINGS } from "../../shared/queries/Queries";

export default graphql(THEME_SETTINGS, {
    options: props => {
        return {
            variables: {
                name: props.name
            }
        };
    },
    props: ({ data: { loading, themeSettings } }) => {
        let newSettings = {};
        if (themeSettings.length > 0) {
            const userValues = JSON.parse(themeSettings[0].value);
            const settings = JSON.parse(themeSettings[0].settings);

            newSettings = settings.map(setting => {
                if (userValues[setting.name]) {
                    setting.defaultValue = userValues[setting.name];
                }
                return setting;
            });
        }
        return {
            themeSettings: newSettings,
            themeSettingsLoading: loading
        };
    }
});
