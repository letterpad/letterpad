import { graphql } from "react-apollo";
import { GET_MEDIA } from "../../shared/queries/Queries";
import config from "../../config";

export default graphql(GET_MEDIA, {
    options: props => ({
        variables: {
            author_id: props.author.id,
            offset:
                (parseInt(props.match.params.page || 1, 0) - 1) *
                config.itemsPerPage,
            limit: config.itemsPerPage
        }
    }),
    props: ({ data: { loading, media } }) => ({
        media,
        loading
    })
});
