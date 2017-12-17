import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ListItem from "../components/posts/ListItem";
import { Link } from "react-router";

const Paginate = ({ count, page }) => {
    const limit = 3;
    const pages = Array.from(Array(Math.floor(count / 3)));

    return (
        <ul className="pagination">
            {pages.map((_, i) => {
                let num = i + 1;
                return (
                    <li>
                        <Link to={"/admin/posts/" + num}>{num}</Link>
                    </li>
                );
            })}
        </ul>
    );
};

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    render() {
        if (this.props.loading && !this.props.posts) {
            return <div>hello</div>;
        }
        let rows = this.props.posts.rows.map((post, i) => {
            return <ListItem key={i} post={post} />;
        });

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Posts</div>
                    <div className="module-subtitle">
                        This page provides a comprehensive overview of all your
                        blog posts. Click the icon next to each post to update
                        its contents or the icon to see what it looks like to
                        your readers.
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th width="5%" className="col-check">
                                    <label className="control control--checkbox">
                                        <input type="checkbox" />
                                        <div className="control__indicator" />
                                    </label>
                                </th>
                                <th width="60%" className="col-text">
                                    Title
                                </th>
                                <th width="10%" className="col-text">
                                    Status
                                </th>
                                <th width="15%" className="col-text">
                                    Author
                                </th>
                                <th width="10%" className="col-text">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                    <Paginate
                        count={this.props.posts.count}
                        page={this.state.page}
                    />
                </div>
            </section>
        );
    }
}

const allPosts = gql`
    query getPosts($type: String!, $offset: Int, $limit: Int) {
        posts(type: $type, offset: $offset, limit: $limit) {
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
    options: props => ({
        variables: {
            type: "post",
            offset: (parseInt(props.params.page) - 1) * 3,
            limit: 3
        },
        forceFetch: true
    }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

export default ContainerWithData(Posts);
