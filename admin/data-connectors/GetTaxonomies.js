import { graphql } from "react-apollo";
import { GET_TAXONOMIES } from "../../shared/queries/Queries";

export default graphql(GET_TAXONOMIES, {
    options: props => {
        return {
            variables: {
                type: props.type
            },
            forceFetch: true,
            fetchPolicy: "network-only"
        };
    },
    props: ({ data: { loading, taxonomies, networkStatus } }) => ({
        taxonomies,
        loading,
        networkStatus
    })
});
