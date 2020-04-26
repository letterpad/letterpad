import { Button, ButtonGroup } from "../../../components/button";
import { EventBusInstance, Events } from "../../../../shared/eventBus";
import { Link, RouteComponentProps } from "react-router-dom";
import { Post, PostStatusOptions } from "../../../../__generated__/gqlTypes";
import React, { Component } from "react";
import StyledTopBar, { PostScheduledText, PostStatusText } from "./TopBar.css";

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
    canRepublish: false,
    showPublishOptions: false,
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
      // if (this.didBodyChange()) {
      const draft = PostActions.getDraft();

      this.setState({
        canRepublish: this.state.post.md_draft.length > 0,
        post: {
          ...this.state.post,
          ...draft,
        },
      });
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

  showPublishOptions = () => {
    if (this.state.post.status === PostStatusOptions.Publish) {
      PostActions.setDraft({ status: PostStatusOptions.Publish });
      return this.publishNow();
    } else {
      this.setState({ settingsOpen: true });
    }
  };

  publishNow = async () => {
    const withHtml = true;
    PostActions.setDraft({ status: PostStatusOptions.Publish });
    await PostActions.updatePost({ withHtml });
    this.setState({ canRepublish: false, showPublishOptions: false });
  };

  render() {
    const goBack = e => {
      e.preventDefault();
      this.props.router.history.push(this.prevPath);
    };

    const isPublished = this.state.post.status === PostStatusOptions.Publish;
    const isScheduled = this.state.post.scheduledAt !== null;
    const canRepublish = this.state.post.md_draft.length > 0;
    const publishDisabled = isPublished && !canRepublish;
    let publishLabel = isPublished ? "Published" : "Publish";
    if (canRepublish && isPublished) {
      publishLabel = "RePublish";
    }

    const { md, md_draft, status } = this.state.post;
    return (
      <StyledTopBar className="article-top-bar">
        <div className="left-block">
          <Link to="#" onClick={goBack} data-testid="go-back">
            <span className="material-icons" style={{ fontSize: 34 }}>
              keyboard_arrow_left
            </span>
          </Link>

          <PostStatusText status={status}>
            {StatusGrammer[status]}
          </PostStatusText>

          {isScheduled && <PostScheduledText>Scheduled</PostScheduledText>}
        </div>
        <div className="right-block">
          <span data-testid="word-count">
            {getWordCount(md_draft || md)} words &nbsp;&nbsp;
          </span>
          <Button
            btnStyle="success"
            btnSize="sm"
            onClick={this.showPublishOptions}
            disabled={publishDisabled}
            data-testid={!isPublished ? "button-settings" : "button-republish"}
          >
            {publishLabel}
          </Button>
          {isPublished && (
            <Button
              compact
              btnStyle="flat"
              btnSize="sm"
              onClick={this.slideSettingsDrawer}
              data-testid="button-settings"
            >
              <i className="fa fa-cog" />
            </Button>
          )}
          <PostSettings
            onDelete={this.deleteAction}
            isOpen={this.state.settingsOpen}
            toggleDisplay={this.slideSettingsDrawer}
            isPublished={isPublished}
            isScheduled={isScheduled}
            canRepublish={canRepublish}
            post={this.state.post}
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

function getWordCount(text: string) {
  return text
    .replace(/\n/, " ")
    .trim()
    .split(" ").length;
}
