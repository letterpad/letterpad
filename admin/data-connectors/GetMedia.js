import { graphql } from "react-apollo";
import { GET_MEDIA } from "../../shared/queries/Queries";
import config from "../../config";

export default graphql(GET_MEDIA, {
    options: props => ({
        variables: {
            author_id: props.author.id,
            offset:
                (parseInt(props.page || props.match.params.page) - 1) *
                config.itemsPerPage,
            limit: config.itemsPerPage
        },
        fetchPolicy: "network-only"
    }),
    props: ({ data: { loading, media, fetchMore } }) => {
        return {
            count: (media && media.count) || 0,
            media,
            loading,
            fetchMore: variables => {
                return fetchMore({
                    variables: variables,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            media: {
                                count: fetchMoreResult.media.count,
                                rows: [
                                    ...previousResult.media.rows,
                                    ...fetchMoreResult.media.rows
                                ],
                                __typename: previousResult.media.__typename
                            }
                        };
                    }
                });
            }
        };
    }
});
