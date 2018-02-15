import React, { Component } from "react";
import ArticleList from "../components/post/ArticleList";
import { gql, graphql } from "react-apollo";
import Loader from "../components/Loader";

const OhSnap = ({ message }) => {
    return (
        <section className="module-xs">
            <div className="row">
                <div className="card">
                    <div className="module-title">Oh Snap!</div>
                    <div className="module-subtitle">{message}</div>
                </div>
            </div>
        </section>
    );
};

class Posts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        if (!this.props.posts) {
            return <OhSnap message="Something wrong happened" />;
        }
        const posts = this.props.posts.map((post, i) => {
            return <ArticleList idx={i} key={i} post={post} />;
        });
        return <div>{posts}</div>;
    }
}

// const allPosts = gql`
//   query getPosts {
//   posts(type:"post") {
//     id,
//     title,
//     body,
//     type,
//     slug,
//     status,
//     created_at,
//     excerpt,
//     cover_image,
//     taxonomies {
//         id,
//         name,
//         type
//     }
//   }
// }
// `;
// const ContainerWithPostData = graphql(allPosts, {
//     props: ({ data: { loading, posts } }) => ({
//         posts,
//         loading
//     })
// });
//------
const catPosts = gql`
    query allPosts($type: String, $slug: String, $postType: String) {
        postsMenu(type: $type, slug: $slug) {
            posts(type: $postType) {
                id
                title
                type
                cover_image
                created_at
                slug
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;
const ContainerWithPostData = graphql(catPosts, {
    options: props => {
        return {
            variables: {
                type: "post_category",
                slug: props.slug || props.match.params.slug,
                postType: "post"
            }
        };
    },
    props: ({ data: { loading, postsMenu } }) => ({
        posts: postsMenu && postsMenu.length >= 0 ? postsMenu[0].posts : null,
        loading
    })
});

export default ContainerWithPostData(Posts);
