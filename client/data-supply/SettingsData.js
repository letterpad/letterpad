import { graphql } from "react-apollo";
import { GET_OPTIONS } from "../../shared/queries/Queries";

export default graphql(GET_OPTIONS, {
    props: ({ data: { loading, settings } }) => {
        const data = {};
        if (settings) {
            settings.forEach(setting => {
                data[setting.option] = setting;
            });
        }
        return {
            settings: {
                data,
                loading
            }
        };
    }
});
