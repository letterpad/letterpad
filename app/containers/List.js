import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ListItem from "../components/posts/ListItem";

export default function List(type) {
    class List extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            if (this.props.loading) {
                return <div>hello</div>;
            }
            let rows = this.props.posts.map((post, i) => {
                return <ListItem key={i} post={post} />;
            });

            return (
                <div className={"wrapper "}>
                    <section className="module-xs">
                        <div className="container-fluid container-custom">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="col-check">
                                            <label className="control control--checkbox">
                                                <input type="checkbox" />
                                                <div className="control__indicator" />
                                            </label>
                                        </th>
                                        <th className="col-text">Title</th>
                                        <th className="col-text">Status</th>
                                        <th className="col-text">Author</th>
                                        <th className="col-text">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </table>
                        </div>
                    </section>
                </div>
            );
        }
    }

    const allPosts = gql`
        query getPosts($type: String!) {
            posts(type: $type) {
                id
                title
                body
                author {
                    username
                }
                status
                created_at
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    `;

    const ContainerWithData = graphql(allPosts, {
        options: props => ({ variables: { type: type } }),
        props: ({ data: { loading, posts } }) => ({
            posts,
            loading
        })
    });

    return ContainerWithData(List);
}
