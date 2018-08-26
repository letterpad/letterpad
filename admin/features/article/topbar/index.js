import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

import StyledTopBar from "./TopBar.css";
import { EventBusInstance } from "../../../../shared/eventBus";
import { plural } from "../../../../shared/util";
import UpdatePost from "../../../data-connectors/UpdatePost";
import PostActions from "../PostActions";
import PublishDropdown from "./PublishDropdown";
import MetaDropdown from "./MetaDropdown";
import StyledDropdown from "../../../components/dropdown";

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
    .publish {
        .dropdown-menu {
            width: 340px;
            margin-left: -190px;
        }
    }
    .meta {
        .dropdown-menu {
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

export class TopBar extends Component {
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
        publishOpen: false,
        metaOpen: false,
        saving: false
    };

    componentDidMount() {
        PostActions.setData(this.props.post);

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
            isPublished: !!+e.target.checked // "false" to false
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

    render() {
        const publishedCls = this.state.isPublished ? "on" : "off";

        const goBackLink = "/admin/" + plural[this.props.post.type];
        const deleteAction = e =>
            this.updatePost(e, {
                status: "trash"
            });

        return (
            <StyledTopBar className="article-top-bar">
                <div className="left-block">
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
                <div className={"right-block " + publishedCls}>
                    <PublishBox>
                        <StyledDropdown name="Publish" className="publish">
                            <PublishDropdown
                                isPublished={this.state.isPublished}
                                changePostStatus={this.changePostStatus}
                                post={this.props.post}
                                create={this.props.create || false}
                                updatePost={this.updatePost}
                            />
                        </StyledDropdown>

                        <StyledDropdown name="Meta" className="meta">
                            <MetaDropdown
                                post={this.props.post}
                                updatePost={this.updatePost}
                            />
                        </StyledDropdown>

                        <div>
                            <Link to="#" onClick={deleteAction}>
                                Trash
                            </Link>
                        </div>
                    </PublishBox>
                </div>
            </StyledTopBar>
        );
    }
}

export default UpdatePost(TopBar);
