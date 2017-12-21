import React, { Component } from "react";
import { graphql } from "react-apollo";
import ListItem from "../components/posts/ListItem";
import { Link } from "react-router";
import { GET_POSTS } from "../../shared/queries/Queries";
import client from "../apolloClient";
import PostsHoc from "./hoc/PostsHoc";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";

class Posts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading && !this.props.posts) {
            return <div>hello</div>;
        }
        let rows = this.props.posts.rows.map((post, i) => {
            return <ListItem key={i} post={post} />;
        });

        const status = this.props.variables.status;
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

                    <PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />
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
                        page={this.props.variables.page}
                        changePage={this.props.changePage}
                    />
                </div>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_POSTS, {
    options: props => ({
        variables: {
            ...props.variables,
            type: "post"
        },
        forceFetch: true
    }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

export default PostsHoc(ContainerWithData(Posts));
