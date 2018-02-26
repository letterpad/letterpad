import React, { Component } from "react";
import PropTypes from "prop-types";
import { PostRows } from "../../components/Post";
import PostsHoc from "./PostsHoc";
import Paginate from "../../components/Paginate";
import { PostFilters } from "../../components/Post";
import Search from "../../components/Post/Search";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "publish",
            loading: true,
            posts: null
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id) {
        this.props.history.push("/admin/posts/" + id);
    }

    render() {
        const loading = this.props.loading; //|| !this.props.networkStatus === 2;
        const { status } = this.props;
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Posts</div>
                    <div className="module-subtitle">
                        Overview of all your blog posts
                    </div>
                    <Search type="post" searchPosts={this.props.searchPosts} />
                    <PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />
                    <table className="table table-hover table-striped">
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

                        <PostRows
                            colSpan={7}
                            handleClick={this.handleClick}
                            posts={this.props.posts}
                            loading={loading}
                        />
                    </table>

                    {!loading && (
                        <Paginate
                            count={this.props.posts.count}
                            page={this.props.page}
                            changePage={this.props.changePage}
                        />
                    )}
                </div>
            </section>
        );
    }
}

Posts.propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    changeStatus: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.object
};
export default PostsHoc(Posts, "post");
