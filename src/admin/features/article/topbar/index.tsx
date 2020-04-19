import { EventBusInstance, Events } from "../../../../shared/eventBus";
import { Link, RouteComponentProps } from "react-router-dom";
import { Post, PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import StyledTopBar, { PostStatusText } from "./TopBar.css";

import { Button } from "../../../components/button";
import PostActions from "../PostActions";
import PostSettings from "./PostSettings";
import config from "../../../../config";
import { notify } from "react-notify-toast";

interface ITopbarProps {
  post: Post;
  edit?: boolean;
  router: RouteComponentProps;
  create?: boolean;
}

export class TopBar extends Component<ITopbarProps, any> {
  prevPath = config.BASE_NAME + "/admin/" + this.props.post.type + "s";
  state = {
    post: this.props.post,
    settingsOpen: false,
    canRepublish: false,
  };
  mounted = true;
  previousHtml = "";

  componentWillMount() {
    EventBusInstance.on(Events.SAVING, () => {
      this.beforePostSave();
    });

    EventBusInstance.on(Events.SAVED, () => {
      this.afterPostSave();
    });

    EventBusInstance.on(Events.DRAFT_CHANGED, () => {
      if (this.didBodyChange()) {
        this.setState({ canRepublish: true });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  didBodyChange = () => {
    const draft = PostActions.getDraft();
    if (!draft.html) return false;
    if (htmlEntities(draft.html) !== htmlEntities(this.state.post.html)) {
      return true;
    }
    return false;
  };

  beforePostSave = () => {
    const post = PostActions.getData();
    const canRepublish = post.status === PostStatusOptions.Publish;
    if (this.didBodyChange() && canRepublish) {
      this.setState({ canRepublish });
    }
  };

  afterPostSave = () => {
    const post = PostActions.getData();
    // if the status is trash, redirect the user to posts or pages depending on the post type.
    if (post.status === PostStatusOptions.Trash) {
      this.props.router.history.goBack();
    } else if (this.mounted) {
      this.setState({ post });
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
    document.location.href = this.prevPath;
  };

  slideSettingsDrawer = (flag?: boolean) => {
    if (flag) {
      return this.setState({ settingsOpen: flag });
    }
    this.setState({ settingsOpen: !this.state.settingsOpen });
  };

  republishHtml = async () => {
    const withHtml = true;
    PostActions.setDraft({ status: PostStatusOptions.Publish });
    await PostActions.updatePost({ withHtml });
    this.setState({ canRepublish: false });
  };

  render() {
    const goBack = e => {
      e.preventDefault();
      this.props.router.history.push(this.prevPath);
    };

    const isPublished = this.state.post.status === PostStatusOptions.Publish;

    let publishLabel = "Publish";
    let publishDisabled = false;
    if (isPublished) {
      publishLabel = this.state.canRepublish ? "Republish" : "Published";
      publishDisabled = this.state.canRepublish ? false : true;
    }

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
          {
            this.state.post.md
              .replace(/\n/, " ")
              .trim()
              .split(" ").length
          }{" "}
          words &nbsp;&nbsp;
          <Button
            btnStyle="primary"
            btnSize="sm"
            onClick={this.republishHtml}
            disabled={publishDisabled}
          >
            {publishLabel}
          </Button>
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

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&quot;");
}
