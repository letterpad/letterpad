import { EventBusInstance, Events } from "../../../../shared/eventBus";
import { Link, RouteComponentProps } from "react-router-dom";
import { Post, PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import StyledTopBar, { AutoSaveIndicator, PostStatusText } from "./TopBar.css";

import { Button } from "../../../components/button";
import PostActions from "../PostActions";
import PostSettings from "./PostSettings";
import { notify } from "react-notify-toast";

interface ITopbarProps {
  post: Post;
  edit?: boolean;
  router: RouteComponentProps;
  create?: boolean;
}

export class TopBar extends Component<ITopbarProps, any> {
  prevPath = "/admin/" + this.props.post.type + "s";
  state = {
    post: this.props.post,
    settingsOpen: false,
  };
  mounted = false;

  componentDidMount() {
    EventBusInstance.on(Events.SAVED, () => {
      this.afterPostSave();
    });
  }

  componentWillUnmount() {
    this.mounted = false;
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
    else if (this.props.edit && this.mounted) {
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
    const update = await PostActions.updatePost();

    if (update.data && update.data.updatePost) {
      let { ok, errors } = update.data.updatePost;
      if (errors) {
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
    this.props.router.history.push(this.prevPath);
  };

  slideSettingsDrawer = (flag?: boolean) => {
    if (flag) {
      return this.setState({ settingsOpen: flag });
    }
    this.setState({ settingsOpen: !this.state.settingsOpen });
  };

  render() {
    const goBack = e => {
      e.preventDefault();
      this.props.router.history.push(this.prevPath);
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
        <div className="right-block">
          <Button
            compact
            btnStyle="flat"
            btnSize="sm"
            onClick={this.slideSettingsDrawer}
          >
            <i className="fa fa-cog" />
          </Button>
          <PostSettings
            onDelete={this.deleteAction}
            isOpen={this.state.settingsOpen}
            toggleDisplay={this.slideSettingsDrawer}
          />
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
