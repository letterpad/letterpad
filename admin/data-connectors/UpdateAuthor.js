import { graphql } from "react-apollo";
import { UPDATE_AUTHOR } from "../../shared/queries/Mutations";

export default graphql(UPDATE_AUTHOR, {
    props: ({ mutate }) => ({
        updateAuthor: data =>
            mutate({
                variables: data
            })
    })
});
