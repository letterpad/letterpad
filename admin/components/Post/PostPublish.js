import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { EventBusInstance } from "../../../shared/eventBus";
import { plural } from "../../../shared/util";
import UpdatePost from "../../data-connectors/UpdatePost";
import PostActions from "./PostActions";
import PublishDropdown from "./PublishDropdown";
import MetaDropdown from "./MetaDropdown";

const PublishBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    a:hover {
        text-decoration: none;
    }
    .meta-label {
        font-weight: 500;
        margin-bottom: 10px;
    }
    > div {
        margin-left: 20px;
        cursor: pointer;
    }
    .dropdown-menu {
        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
        &.publish {
            width: 340px;
            margin-left: -190px;
        }
        &.meta {
            width: 320px;
            margin-left: -240px;
        }
    }
`;

const AutoSaveIndicator = styled.div`
    .spinner {
        width: 70px;
        text-align: center;
    }

    .spinner > div {
        width: 6px;
        height: 6px;
        background-color: #0eaf10;
        margin-right: 4px;
        border-radius: 100%;
        display: inline-block;
        animation: sk-bouncedelay 1s infinite ease-in-out both;
    }

    .spinner .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
        background-color: #27b0ed;
    }

    .spinner .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
        background-color: #f33f43;
    }

    @keyframes sk-bouncedelay {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
`;

export class PostPublish extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired,
        edit: PropTypes.bool,
        history: PropTypes.object.isRequired,
        create: PropTypes.bool
    };

    publishDropdownBtnRef = React.createRef();
    metaDropdownBtnRef = React.createRef();

    state = {
        post: this.props.post,
        isPublished: this.props.post.status == "publish",
        publishOpen: false,
        metaOpen: false,
        saving: false
    };

    componentDidMount() {
        PostActions.setData(this.props.post);
        document.addEventListener("click", this.closeDropdowns);

        EventBusInstance.on("ARTICLE_SAVING", () => {
            this.setState({ saving: true });
        });
        EventBusInstance.on("ARTICLE_SAVED", () => {
            // updates are really fast.
            // Let the saving state atleast for half a second to show our nice loader.
            // Users should know we have auto-save option.
            setTimeout(() => {
                this.setState({ saving: false });
            }, 500);
        });
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
            // If this is the first update to the post, there should be a new slug that was generated.
            // Add this to PostActions as this is the only new data that was generated in the backend.
            PostActions.setData({ slug: update.data.updatePost.post.slug });
            return this.afterPostSave(update.data.updatePost.post);
        }
        let errors = update.data.updatePost.errors;
        if (errors && errors.length > 0) {
            errors = errors.map(error => error.message);
            notify.show(errors.join("\n"), "error", 3000);
        }
    };

    togglePublishDropdown = flag => {
        this.setState({
            publishOpen: flag ? flag : !this.state.publishOpen
        });
    };

    toggleMetaDropdown = flag => {
        this.setState({
            metaOpen: flag ? flag : !this.state.metaOpen
        });
    };

    closeDropdowns = e => {
        if (
            this.publishDropdownBtnRef.current &&
            !this.publishDropdownBtnRef.current.parentNode.contains(e.target) &&
            this.state.publishOpen
        ) {
            this.setState({ publishOpen: false });
        }

        if (
            this.metaDropdownBtnRef.current &&
            !this.metaDropdownBtnRef.current.parentNode.contains(e.target) &&
            this.state.metaOpen
        ) {
            this.setState({ metaOpen: false });
        }
    };

    render() {
        const publishedCls = this.state.isPublished ? "on" : "off";
        const ddClassPublish =
            "dropdown" + (this.state.publishOpen ? " open" : "");
        const ddClassMeta = "dropdown" + (this.state.metaOpen ? " open" : "");
        const goBackLink = "/admin/" + plural[this.props.post.type];
        const deleteAction = e =>
            this.updatePost(e, {
                status: "trash"
            });

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
                {this.state.saving && (
                    <AutoSaveIndicator>
                        <div className="spinner">
                            <div className="bounce1" />
                            <div className="bounce2" />
                            <div className="bounce3" />
                        </div>
                    </AutoSaveIndicator>
                )}
                <div className={"switch-block " + publishedCls}>
                    <PublishBox>
                        <div className={ddClassPublish}>
                            <a
                                className="dropdown-toggle"
                                href="#"
                                ref={this.publishDropdownBtnRef}
                                onClick={e => {
                                    e.preventDefault();
                                    this.togglePublishDropdown();
                                }}
                            >
                                Publish
                                <span className="caret" />
                            </a>

                            <div className="dropdown-menu publish">
                                <PublishDropdown
                                    isPublished={this.state.isPublished}
                                    changePostStatus={this.changePostStatus}
                                    post={this.props.post}
                                    togglePublishDropdown={
                                        this.togglePublishDropdown
                                    }
                                    isOpen={this.state.publishOpen}
                                    create={this.props.create || false}
                                    updatePost={this.updatePost}
                                />
                            </div>
                        </div>
                        <div className={ddClassMeta}>
                            <a
                                ref={this.metaDropdownBtnRef}
                                className="dropdown-toggle"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.toggleMetaDropdown();
                                }}
                            >
                                <span className="material-icons">
                                    graphic_eq
                                </span>
                            </a>

                            <div className="dropdown-menu meta">
                                <MetaDropdown
                                    post={this.props.post}
                                    toggleMetaDropdown={this.toggleMetaDropdown}
                                    isOpen={this.state.metaOpen}
                                    updatePost={this.updatePost}
                                />
                            </div>
                        </div>
                        <div>
                            <Link to="#" onClick={deleteAction}>
                                Trash
                            </Link>
                        </div>
                    </PublishBox>
                </div>
            </div>
        );
    }
}

export default UpdatePost(PostPublish);
