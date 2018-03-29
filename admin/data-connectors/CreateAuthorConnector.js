import { graphql } from "react-apollo";
import { CREATE_AUTHOR } from "../../shared/queries/Mutations";

export default graphql(CREATE_AUTHOR, {
    props: ({ mutate }) => ({
        createAuthor: data =>
            mutate({
                variables: data
            })
    })
});
