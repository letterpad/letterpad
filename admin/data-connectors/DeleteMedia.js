import { graphql } from "react-apollo";
import { DELETE_MEDIA } from "../../shared/queries/Mutations";

export default graphql(DELETE_MEDIA, {
    props: ({ mutate }) => ({
        deleteMedia: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getMedia: (prev, { mutationResult }) => {
                        return {
                            media: {
                                count: prev.media.count - 1,
                                rows: prev.media.rows.filter(item => {
                                    return (
                                        item.id !=
                                        mutationResult.data.deleteMedia.id
                                    );
                                }),
                                __typename: "MediaNode"
                            }
                        };
                    }
                }
            })
    })
});
