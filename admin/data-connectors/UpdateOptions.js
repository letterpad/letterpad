import { graphql } from "react-apollo";
import { UPDATE_OPTIONS } from "../../shared/queries/Mutations";

export default graphql(UPDATE_OPTIONS, {
    props: ({ mutate }) => {
        return {
            updateOptions: data =>
                mutate({
                    variables: { options: data },
                    updateQuery: (previousResult, { mutationResult }) => {
                        return {
                            settings: [...mutationResult.data.updatedOptions]
                        };
                    }
                })
        };
    }
});
