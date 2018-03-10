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
        const { t } = this.context;
        const loading = this.props.loading; //|| !this.props.networkStatus === 2;
        const { status } = this.props;
        return (
            <section className="module-xs fs-normal">
                <div className="card">
                    <div className="module-title">{t("posts.title")}</div>
                    <div className="module-subtitle">{t("posts.tagline")}</div>
                    <div className="action-bar">
                        <Search
                            type="post"
                            searchPosts={this.props.searchPosts}
                        />
                        <div className="action-delete">
                            {this.props.selectedPosts.length > 0 && (
                                <button
                                    className="btn btn-xs btn-danger"
                                    onClick={this.props.deletedSelectedPosts}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%" className="col-check">
                                    <label className="control control--checkbox">
                                        <input
                                            type="checkbox"
                                            onClick={this.props.selectAllPosts}
                                        />
                                        <div className="control__indicator" />
                                    </label>
                                </th>
                                <th width="25%" className="col-text">
                                    {t("common.title")}
                                </th>
                                <th width="20%" className="col-text">
                                    {t("common.categories")}
                                </th>
                                <th width="20%" className="col-text">
                                    {t("common.tags")}
                                </th>
                                <th width="5%" className="col-text">
                                    {t("common.status")}
                                </th>
                                <th width="10%" className="col-text">
                                    {t("common.author")}
                                </th>
                                <th width="10%" className="col-text">
                                    {t("common.createdAt")}
                                </th>
                            </tr>
                        </thead>

                        <PostRows
                            colSpan={7}
                            handleClick={this.handleClick}
                            posts={this.props.posts}
                            loading={loading}
                            setSelection={this.props.setSelection}
                            selectedPosts={this.props.selectedPosts}
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

Posts.contextTypes = {
    t: PropTypes.func
};

export default PostsHoc(Posts, "post");
