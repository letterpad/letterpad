import { graphql } from "react-apollo";
import { DELETE_MEDIA } from "../../shared/queries/Mutations";

export default graphql(DELETE_MEDIA, {
    props: ({ mutate }) => ({
        deleteMedia: data =>
            mutate({
                variables: { ids: data.join(",") },
                updateQueries: {
                    getMedia: prev => {
                        return {
                            media: {
                                count: prev.media.count - data.length,
                                rows: prev.media.rows.filter(
                                    item => data.indexOf(item.id) == -1
                                ),
                                __typename: "MediaNode"
                            }
                        };
                    }
                }
            })
    })
});
