import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ListItem from "../components/posts/ListItem";
import BreadCrumb from "../components/BreadCrumb.js";

const Paginate = ({ count, onClick, page }) => {
    const limit = 2;
    const pages = Array.from(Array(Math.ceil(count / 2)));

    return (
        <ul className="pagination">
            {pages.map((_, i) => {
                let num = i + 1;
                return (
                    <li>
                        <a href="#" data-page={num} onClick={onClick}>
                            {num}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default function List(type) {
    let title = "post";
    switch (type) {
        case "post":
            title = "Posts";
            break;
        case "page":
            title = "Pages";
            break;
    }

    class List extends Component {
        constructor(props) {
            super(props);
            this.state = {
                page: 1
            };
            this.handlePageClick = this.handlePageClick.bind(this);
        }
        handlePageClick() {}

        render() {
            if (this.props.loading) {
                return <div>hello</div>;
            }
            let rows = this.props.posts.rows.map((post, i) => {
                return <ListItem key={i} post={post} />;
            });

            return (
                <div className="wrapper">
                    <section className="module-xs">
                        <div className="module-title">{title}</div>
                        <div className="container-fluid">
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
                            <Paginate
                                count={this.props.posts.count}
                                onClick={this.handlePageClick}
                                page={this.state.page}
                            />
                        </div>
                    </section>
                </div>
            );
        }
    }

    const allPosts = gql`
        query getPosts($type: String!) {
            posts(type: $type) {
                count
                rows {
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
