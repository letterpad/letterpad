import { Link, RouteComponentProps } from "react-router-dom";
import { Post, PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import StyledTopBar, {
  AutoSaveIndicator,
  PostStatusText,
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
}

export class TopBar extends Component<ITopbarProps, any> {
  state = {
    post: this.props.post,
    // isPublished: this.props.post.status == "publish",
    publishOpen: false,
    metaOpen: false,
    saving: false,
  };

  componentDidMount() {
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

  afterPostSave = () => {
    const post = PostActions.getData();
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

  updatePost = async () => {
    this.setState({ saving: true });
    const update = await PostActions.updatePost();
    setTimeout(() => {
      this.setState({ saving: false });
    }, 500);

    if (update.data && update.data.updatePost) {
      let { ok, errors } = update.data.updatePost;
      if (ok) {
        return this.afterPostSave();
      } else if (errors) {
        if (errors && errors.length > 0) {
          const errorsUI = errors.map(error => error.message).join("\n");
          notify.show(errorsUI, "error", 3000);
        }
      }
    }
  };

  deleteAction = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    PostActions.setDraft({ status: PostStatusOptions.Trash });
    await PostActions.updatePost();
    this.props.router.history.push("/admin/posts");
  };

  render() {
    const publishedCls = this.state.isPublished ? "on" : "off";

    const goBack = e => {
      e.preventDefault();
      this.props.router.history.push("/admin/posts");
    };

    return (
      <StyledTopBar className="article-top-bar">
        <div className="left-block">
          <Link to="#" onClick={goBack}>
            <span className="material-icons" style={{ fontSize: 34 }}>
              keyboard_arrow_left
            </span>
          </Link>

          <PostStatusText status={this.state.post.status}>
            {StatusGrammer[this.state.post.status]}
          </PostStatusText>
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
              render={(
                isOpen: boolean,
                toggleVisibility: (e?: Event, flag?: boolean) => void,
              ) => {
                if (!isOpen) return null;
                return (
                  <PublishDropdown
                    toggleVisibility={toggleVisibility}
                    post={this.props.post}
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
              <Link to="#" onClick={this.deleteAction}>
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
