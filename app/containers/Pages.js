import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import ListItem from "../components/posts/ListItem";
import PostsHoc from "./hoc/PostsHoc";
import { GET_POSTS } from "../../shared/queries/Queries";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";

class Pages extends Component {
    handleClick(id) {
        this.props.history.push("/admin/pages/" + id);
    }
    render() {
        if (this.props.loading && !this.props.posts) {
            return <div>hello</div>;
        }
        const rows = this.props.posts.rows.map((post, i) => (
            <ListItem {...this.props} key={i} post={post} />
        ));

        const { status } = this.props.variables;

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Pages</div>
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
                                <th className="col-check">
                                    <label className="control control--checkbox">
                                        <input type="checkbox" />
                                        <div className="control__indicator" />
                                    </label>
                                </th>
                                <th className="col-text">Title</th>
                                <th className="col-text">Categories</th>
                                <th className="col-text">Tags</th>
                                <th className="col-text">Status</th>
                                <th className="col-text">Author</th>
                                <th className="col-text">Created At</th>
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
            type: "page"
        },
        forceFetch: true
    }),
    props: ({ data: { loading, posts } }) => ({
        posts,
        loading
    })
});

Pages.propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    changeStatus: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.func
};

export default PostsHoc(ContainerWithData(Pages));
