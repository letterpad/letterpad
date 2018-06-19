import React, { Component } from "react";
import { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import PostActions from "./PostActions";
import UpdatePost from "../../data-connectors/UpdatePost";
import PropTypes from "prop-types";
import { plural } from "../../../shared/util";

export class PostPublish extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired,
        edit: PropTypes.bool,
        history: PropTypes.object.isRequired,
        create: PropTypes.bool,
        toggleActionDrawer: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.changePostStatus = this.changePostStatus.bind(this);
        this.toggleZenView = this.toggleZenView.bind(this);
        this.afterPostSave = this.afterPostSave.bind(this);
        this.state = {
            post: this.props.post,
            published: this.props.post.status == "publish",
            zenview: false
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const status = prevState.post.status == "publish" ? 1 : 0;
        return {
            published: status
        };
    }

    componentDidMount() {
        PostActions.setData(this.props.post);
    }

    changePostStatus(e) {
        this.setState({
            published: ~~e.target.checked
        });
    }
    afterPostSave(post) {
        let eventName = null;
        let notifyMessage = null;
        // if the status is trash, redirect the user to posts or pages depending on the post type.
        if (post.status == "trash") {
            notifyMessage = "Post trashed";
            this.props.history.push(`/admin/${plural[post.type]}`);
        }
        // If the post is new, then redirect the user to the edit section
        else if (this.props.create) {
            eventName = "onPostCreate";
            notifyMessage = "Post created";
            this.props.history.push(`/admin/${plural[post.type]}/${post.id}`);
        }
        // if the post is in edit mode, trigger the event
        else if (this.props.edit) {
            eventName = "onPostUpdate";
            notifyMessage = "Post updated";
            this.setState({ post });
        }
        if (notifyMessage) {
            try {
                // In tests notify will not work.
                notify.show(notifyMessage, "success", 3000);
            } catch (e) {
                //... leave this empty
            }
        }
        if (eventName) {
            // Trigger an event. This will allow other components to listen to post create, update events
            PostActions.triggerEvent(eventName, post);
        }
    }
    async updatePost(e, statusObj) {
        if (e) e.preventDefault();
        PostActions.setData(statusObj);
        let data = PostActions.getData();
        const update = await this.props.update({
            ...this.props.post,
            ...data
        });

        if (update.data.updatePost.ok) {
            return this.afterPostSave(update.data.updatePost.post);
        }
        let errors = update.data.updatePost.errors;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "error", 3000);
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
                        className={"publish-btn btn btn-sm " + btnType}
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

export default UpdatePost(PostPublish);
