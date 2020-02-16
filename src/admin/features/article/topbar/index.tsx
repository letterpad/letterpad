import { Link, RouteComponentProps } from "react-router-dom";
import { Post, PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import StyledTopBar, {
  AutoSaveIndicator,
  PostStatus,
  PublishBox,
} from "./TopBar.css";

import { EventBusInstance } from "../../../../shared/eventBus";
import MetaDropdown from "./MetaDropdown";
import PostActions from "../PostActions";
import PublishDropdown from "./PublishDropdown";
import StyledDropdown from "../../../components/dropdown";
import { notify } from "react-notify-toast";

interface ITopbarProps {
  post: Post;
  edit?: boolean;
  router: RouteComponentProps;
  create?: boolean;
  updatePost: () => any;
}

export class TopBar extends Component<ITopbarProps, any> {
  state = {
    post: this.props.post,
    isPublished: this.props.post.status == "publish",
    publishOpen: false,
    metaOpen: false,
    saving: false,
  };

  componentDidMount() {
    PostActions.setData(this.props.post);

    EventBusInstance.on("ARTICLE_SAVING", () => {
      this.setState({ saving: true });
    });
    EventBusInstance.on("ARTICLE_SAVED", () => {
      // updates are really fast.
      // Let the saving state stay atleast for half a second to show the loader.
      // Users should know we have auto-save option.
      setTimeout(() => {
        this.setState({ saving: false });
      }, 500);
    });
  }

  changePostStatus = status => {
    this.setState({
      isPublished: status,
    });
  };

  afterPostSave = (post: Post) => {
    let eventName = "";
    let notifyMessage = "";
    // if the status is trash, redirect the user to posts or pages depending on the post type.
    if (post.status === PostStatusOptions.Trash) {
      notifyMessage = "Post trashed";
      this.props.router.history.goBack();
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

  updatePost = async statusObj => {
    PostActions.setData(statusObj);

    const update = await this.props.updatePost();

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

    const goBack = e => {
      e.preventDefault();
      this.props.router.history.goBack();
    };
    const deleteAction = (e: React.SyntheticEvent) => {
      e.preventDefault();
      this.updatePost({
        status: "trash",
      });
    };

    return (
      <StyledTopBar className="article-top-bar">
        <div className="left-block">
          <Link to="#" onClick={goBack}>
            <span className="material-icons" style={{ fontSize: 34 }}>
              keyboard_arrow_left
            </span>
          </Link>

          <PostStatus status={this.state.post.status}>
            {StatusGrammer[this.state.post.status]}
          </PostStatus>
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
            <StyledDropdown
              name="Publish"
              className="publish"
              render={(isOpen, toggleVisibility) => {
                if (!isOpen) return null;
                return (
                  <PublishDropdown
                    toggleVisibility={toggleVisibility}
                    isPublished={this.state.isPublished}
                    changePostStatus={this.changePostStatus}
                    post={this.props.post}
                    create={this.props.create || false}
                    updatePost={this.updatePost}
                  />
                );
              }}
            />

            <StyledDropdown
              name="Meta"
              className="meta"
              render={(close: () => void) => (
                <MetaDropdown
                  post={this.props.post}
                  updatePost={this.updatePost}
                  close={close}
                />
              )}
            />

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

export default TopBar;

const StatusGrammer = {
  publish: "Published",
  draft: "In-Draft",
  trash: "In-Trash",
};
