import { graphql } from "react-apollo";
import { CREATE_POST } from "../../shared/queries/Mutations";

export default graphql(CREATE_POST, {
    props: ({ mutate }) => ({
        createPost: data =>
            mutate({
                variables: data
            })
    })
});
