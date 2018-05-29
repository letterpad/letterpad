import React, { Component } from "react";
import { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";
import moment from "moment";
import config from "../../../config";
import { UPDATE_POST_QUERY } from "../../../shared/queries/Mutations";
import { makeUrl } from "../../../shared/util";

const actions = {
    publish: "Published",
    draft: "Save Draft"
};
class PostPublish extends Component {
    constructor(props) {
        super(props);
        this.changePostStatus = this.changePostStatus.bind(this);
        this.toggleZenView = this.toggleZenView.bind(this);
        this.state = {
            post: this.props.post,
            published: 0,
            zenview: false
        };
    }
    componentWillReceiveProps(nextProps) {
        const status = nextProps.post.status == "publish" ? 1 : 0;
        this.setState({ published: status });
    }

    componentDidMount() {
        PostActions.setData(this.props.post);
    }

    changePostStatus(e) {
        this.setState({
            published: ~~e.target.checked
        });
    }

    async updatePost(e, status) {
        e.preventDefault();
        PostActions.setData(status);
        let data = PostActions.getData();
        const update = await this.props.update({
            ...this.props.post,
            ...data
        });
        if (update.data.updatePost.ok) {
            // If any component has subscribed to get notifications on update/delete, it will be notified.
            if (this.props.edit) {
                PostActions.postUpdated("update", update.data.updatePost.post);
            } else {
                PostActions.postUpdated(
                    "onPostCreate",
                    update.data.updatePost.post
                );
                return notify.show("Post created", "success", 3000);
            }
            if (this.props.post.status === "trash") {
                return notify.show("Post trashed", "success", 3000);
            }
            this.setState({ post: update.data.updatePost.post });
            return notify.show("Post updated", "success", 3000);
        }
        let errors = update.data.updatePost.errors;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errore.join("\n"), "error", 3000);
        }
    }

    getButton(label, btnType = "btn-primary", status) {
        if (typeof status == "undefined") {
            status = this.state.published ? "publish" : "draft";
        }
        if (status)
            return (
                <div className="btn-item">
                    <button
                        type="submit"
                        onClick={e => this.updatePost(e, { status: status })}
                        className={"btn btn-sm " + btnType}
                    >
                        {label}
                    </button>
                </div>
            );
    }
    toggleZenView(e) {
        e.preventDefault();
        document.body.classList.toggle("distract-free");
    }
    render() {
        const publishedCls = this.state.published ? "on" : "off";
        const permalink = makeUrl([this.state.post.type, this.state.post.slug]);
        const actionLabel = this.props.create ? "Create" : "Update";
        return (
            <div className="card post-publish">
                <div className="btn-together">
                    {this.getButton(actionLabel, "btn-primary")}
                    {this.getButton(
                        "Trash",
                        "btn-danger btn-danger-invert",
                        "trash"
                    )}
                </div>

                <div className={"switch-block " + publishedCls}>
                    <span className="switch-label switch-off-text">Draft</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={this.changePostStatus}
                            checked={this.state.published}
                        />
                        <span className="slider round" />
                    </label>
                    <span className="switch-label switch-on-text">Publish</span>
                    <Link
                        to="#"
                        className="action-drawer-btn"
                        onClick={this.toggleZenView}
                    >
                        <i className="fa fa-eye" />
                    </Link>
                    <Link
                        to="#"
                        className="action-drawer-btn"
                        onClick={this.props.toggleActionDrawer}
                    >
                        <i className="fa fa-cog" />
                    </Link>
                </div>
            </div>
        );
    }
}

const updateQueryWithData = graphql(UPDATE_POST_QUERY, {
    props: ({ mutate }) => ({
        update: data => {
            return mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        return {
                            post: {
                                ...prev.post,
                                ...mutationResult.data.updatePost.post
                            }
                        };
                    }
                }
            });
        }
    })
});
export default updateQueryWithData(PostPublish);
