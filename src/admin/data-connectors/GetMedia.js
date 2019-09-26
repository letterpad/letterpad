import { graphql } from "@apollo/react-hoc";
import { GET_MEDIA } from "../../shared/queries/Queries";
import config from "../../config";

export default graphql(GET_MEDIA, {
  options: props => ({
    variables: {
      authorId: props.author.id,
      offset:
        (parseInt(props.page || props.match.params.page) - 1) *
        config.mediaPerPage,
      limit: config.mediaPerPage,
    },
    fetchPolicy: "network-only",
  }),
  props: ({ data: { loading, media, fetchMore } }) => {
    return {
      count: (media && media.count) || 0,
      media,
      loading,
      fetchMore: variables => {
        let merge = false;
        if (variables.merge) {
          merge = true;
          delete variables.merge;
        }
        return fetchMore({
          variables: variables,
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              media: {
                count: fetchMoreResult.media.count,
                rows: merge
                  ? [
                      ...previousResult.media.rows,
                      ...fetchMoreResult.media.rows,
                    ]
                  : [...fetchMoreResult.media.rows],
                __typename: previousResult.media.__typename,
              },
            };
          },
        });
      },
    };
  },
});
