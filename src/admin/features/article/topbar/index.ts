import React, { Component } from "react";
import { notify } from "react-notify-toast";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import StyledTopBar, { AutoSaveIndicator, PublishBox } from "./TopBar.css";
import { EventBusInstance } from "../../../../shared/eventBus";
import PostActions from "../PostActions";
import PublishDropdown from "./PublishDropdown";
import MetaDropdown from "./MetaDropdown";
import StyledDropdown from "../../../components/dropdown";
import client from "../../../../shared/apolloClient";
import { UPDATE_POST_QUERY } from "../../../../shared/queries/Mutations";

export class TopBar extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    router: PropTypes.object.isRequired,
    create: PropTypes.bool,
  };

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

  afterPostSave = post => {
    let eventName = null;
    let notifyMessage = null;
    // if the status is trash, redirect the user to posts or pages depending on the post type.
    if (post.status === "trash") {
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

  updatePost = async (e, statusObj) => {
    if (e) e.preventDefault();
    PostActions.setData(statusObj);
    let data = PostActions.getData();
    const postData = {
      ...this.props.post,
      ...data,
    };
    const {
      // eslint-disable-next-line no-unused-vars
      createdAt,
      // eslint-disable-next-line no-unused-vars
      publishedAt,
      // eslint-disable-next-line no-unused-vars
      updatedAt,
      // eslint-disable-next-line no-unused-vars
      mode,
      // eslint-disable-next-line no-unused-vars
      author,
      // eslint-disable-next-line no-unused-vars
      __typename,
      ...post
    } = postData;
    const update = await client().mutate({
      mutation: UPDATE_POST_QUERY,
      variables: {
        data: post,
      },
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

    const goBack = e => {
      e.preventDefault();
      this.props.router.history.goBack();
    };
    const deleteAction = e =>
      this.updatePost(e, {
        status: "trash",
      });

    return (
      <StyledTopBar className="article-top-bar">
        <div className="left-block">
          <Link to="#" onClick={goBack}>
            <span className="material-icons" style={{ fontSize: 34 }}>
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
            <StyledDropdown
              name="Publish"
              className="publish"
              render={() => {
                return (
                  <PublishDropdown
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
              render={close => (
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
