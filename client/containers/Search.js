import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { gql, graphql } from "react-apollo";

export default function Search(term) {
    class Search extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <div>
                    {(() => {
                        if (this.props.loading) {
                            return <div>hello</div>;
                        } else {
                            return this.props.posts.map((post, i) => {
                                return <ArticleList key={i} post={post} />;
                            });
                        }
                    })()}
                </div>
            );
        }
    }

    if (term == "post") {
        const allPosts = gql`
            query getPosts($type:String!,$query:String!) {
                posts(type:$type,body:$query) {
                    id,
                    title,
                    body,
                    author {
                        username
                    },
                    status,
                    created_at,
                    excerpt,
                    cover_image,
                    taxonomies {
                        id,
                        name,
                        type
                    }
                }
            }
        `;
        const ContainerWithData = graphql(allPosts, {
            options: props => {
                return {
                    variables: {
                        type: "post",
                        query: '{ "like": "%' + props.params.query + '%" }'
                    }
                };
            },
            props: ({ data: { loading, posts } }) => ({
                posts,
                loading
            })
        });
        return ContainerWithData(Search);
    } else if (term == "category") {
        const catPosts = gql`
            query catPosts($type:String,$query:String,$postType:String){
                postTaxonomies(type:$type,name:$query) {
                    posts(type:$postType) {
                        id
                        title
                        body
                        cover_image
                        created_at
                        permalink
                        excerpt
                        taxonomies {
                            id,
                            name,
                            type
                        }
                    }
                }
            }
            `;
        const ContainerWithData = graphql(catPosts, {
            options: props => {
                return {
                    variables: {
                        type: "post_category",
                        query: props.params.query,
                        postType: "post"
                    }
                };
            },
            props: ({ data: { loading, postTaxonomies } }) => ({
                posts: postTaxonomies ? postTaxonomies[0].posts : [],
                loading
            })
        });
        return ContainerWithData(Search);
    } else if (term == "tag") {
        const catPosts = gql`
            query catPosts($type:String,$query:String,$postType:String){
                postTaxonomies(type:$type,name:$query) {
                    posts(type:$postType) {
                        id
                        title
                        body
                        cover_image
                        created_at
                        permalink
                        excerpt
                        taxonomies {
                            id,
                            name,
                            type
                        }
                    }
                }
            }
            `;
        const ContainerWithData = graphql(catPosts, {
            options: props => {
                return {
                    variables: {
                        type: "post_tag",
                        query: props.params.query,
                        postType: "post"
                    }
                };
            },
            props: ({ data: { loading, postTaxonomies } }) => ({
                posts: postTaxonomies ? postTaxonomies[0].posts : [],
                loading
            })
        });
        return ContainerWithData(Search);
    }
    return Search;
}
