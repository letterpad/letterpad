import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PostActions from "./PostActions";
import UpdatePost from "../../data-connectors/UpdatePost";
import PropTypes from "prop-types";
import { plural } from "../../../shared/util";
import PostActionDrawer from "./PostActionDrawer";
import styled from "styled-components";
import { Link } from "react-router-dom";

const DropDown = styled.ul`
    margin-left: -240;
    width: 340px;
    padding: 20px;
    max-height: 90vh;
    overflow-y: auto;
`;

export class PostPublish extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired,
        edit: PropTypes.bool,
        history: PropTypes.object.isRequired,
        create: PropTypes.bool
    };

    state = {
        post: this.props.post,
        isPublished: this.props.post.status == "publish",
        openPublish: false
    };

    componentDidMount() {
        PostActions.setData(this.props.post);
    }

    changePostStatus = e => {
        this.setState({
            isPublished: ~~e.target.checked
        });
    };
    afterPostSave = post => {
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
    };

    updatePost = async (e, statusObj) => {
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
    };

    toggleDropdown = () => {
        this.setState({ openPublish: !this.state.openPublish });
    };

    closeDropdown = () => {
        setTimeout(() => {
            this.setState({ openPublish: false });
        }, 100);
    };
    render() {
        const publishedCls = this.state.isPublished ? "on" : "off";
        const ddClass = "dropdown" + (this.state.openPublish ? " open" : "");
        const goBackLink = "/admin/" + plural[this.props.post.type];
        return (
            <div className="post-publish">
                <div className="btn-together">
                    <Link to={goBackLink}>
                        <span
                            className="material-icons"
                            style={{ fontSize: 34 }}
                        >
                            keyboard_arrow_left
                        </span>
                    </Link>
                </div>

                <div className={"switch-block " + publishedCls}>
                    <div className="user-info">
                        <div className={ddClass}>
                            <a
                                className="dropdown-toggle"
                                onClick={this.toggleDropdown}
                            >
                                Publish
                                <span className="caret" />
                            </a>

                            <DropDown className="dropdown-menu">
                                <PostActionDrawer
                                    isPublished={this.state.isPublished}
                                    changePostStatus={this.changePostStatus}
                                    post={this.props.post}
                                    toggleActionDrawer={this.toggleDropdown}
                                    isOpen={this.state.openPublish}
                                    create={this.props.create || false}
                                    updatePost={this.updatePost}
                                />
                            </DropDown>
                        </div>
                        <Link
                            style={{ marginLeft: "20px" }}
                            to="#"
                            onClick={e =>
                                this.updatePost(e, {
                                    status: "trash"
                                })
                            }
                        >
                            Trash
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdatePost(PostPublish);
