import { graphql } from "react-apollo";
import { PAGE_MENU } from "../../shared/queries/Queries";

export default graphql(PAGE_MENU, {
    options: props => {
        return {
            variables: {
                slug: props.slug || props.match.params.slug,
                postType: "page"
            }
        };
    },
    props: ({ data: { loading, pageMenu } }) => ({
        page: pageMenu ? pageMenu.post : null,
        loading
    })
});
