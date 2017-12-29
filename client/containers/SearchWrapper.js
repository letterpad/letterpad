import React, { Component } from "react";
import { graphql } from "react-apollo";
import ArticleList from "../components/post/ArticleList";
import appoloClient from "../apolloClient";

import Loader from "../../app/components/Loader";
import { SEARCH_POSTS_BY_TAXONOMY } from "../../shared/queries/Queries";

//export default function SearchWrapper(term) {
export default class SearchWrapper extends Component {
    async componentWillMount() {
        let result = await appoloClient.query({
            query: SEARCH_POSTS_BY_TAXONOMY,
            variables: {
                type: "post_category",
                query: this.props.match.params.query,
                postType: "post"
            }
        });
        console.log(result);
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        return <div>cadc</div>;
        // const data = this.props.posts.map((post, i) => (
        //     <ArticleList key={i} post={post} />
        // ));
        // return <div>{data}</div>;
    }
}

//     if (term === "post") {
//         const ContainerWithData = graphql(SEARCH_POSTS, {
//             options: props => {
//                 return {
//                     variables: {
//                         type: "post",
//                         query:
//                             '{ "like": "%' + props.match.params.query + '%" }'
//                     }
//                 };
//             },
//             props: ({ data: { loading, posts } }) => ({
//                 posts,
//                 loading
//             })
//         });
//         return ContainerWithData(Search);
//     } else if (term === "category") {
//         const ContainerWithData = graphql(SEARCH_POSTS_BY_TAXONOMY, {
//             options: props => {
//                 return {
//                     variables: {
//                         type: "post_category",
//                         query: props.params.query,
//                         postType: "post"
//                     }
//                 };
//             },
//             props: ({ data: { loading, postTaxonomies } }) => ({
//                 posts:
//                     postTaxonomies && postTaxonomies.length > 0
//                         ? postTaxonomies[0].posts
//                         : [],
//                 loading
//             })
//         });
//         return ContainerWithData(Search);
//     } else if (term === "tag") {
//         const ContainerWithData = graphql(SEARCH_POSTS_BY_TAXONOMY, {
//             options: props => {
//                 return {
//                     variables: {
//                         type: "post_tag",
//                         query: props.params.query,
//                         postType: "post"
//                     }
//                 };
//             },
//             props: ({ data: { loading, postTaxonomies } }) => ({
//                 posts:
//                     postTaxonomies && postTaxonomies.length > 0
//                         ? postTaxonomies[0].posts
//                         : [],
//                 loading
//             })
//         });
//         return ContainerWithData(Search);
//     }
//     return Search;
// }
