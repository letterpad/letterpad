import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import ListItem from "../components/posts/ListItem";
import { GET_POSTS } from "../../shared/queries/Queries";
import PostsHoc from "./hoc/PostsHoc";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id) {
        this.props.history.push("/admin/posts/" + id);
    }

    render() {
        if (this.props.loading && !this.props.posts) {
            return <div>hello</div>;
        }
        const rows = this.props.posts.rows.map((post, i) => (
            <ListItem handleClick={this.handleClick} key={i} post={post} />
        ));

        const { status } = this.props.variables;
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
                                <th width="25%" className="col-text">
                                    Title
                                </th>
                                <th width="20%" className="col-text">
                                    Categories
                                </th>
                                <th width="20%" className="col-text">
                                    Tags
                                </th>
                                <th width="5%" className="col-text">
                                    Status
                                </th>
                                <th width="10%" className="col-text">
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
Posts.propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    changeStatus: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.func
};
export default PostsHoc(ContainerWithData(Posts));
