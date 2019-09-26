import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledArticle from "./Article.css";

import LetterpadEditor from "letterpad-editor";
import PostActions from "./PostActions";
import PostTitle from "./PostTitle";
import FileExplorerModal from "../modals/FileExplorerModal";
import { uploadFile } from "../../server/util";
import { EventBusInstance } from "../../../shared/eventBus";
import UpdatePost from "../../data-connectors/UpdatePost";
import InsertMedia from "../../data-connectors/InsertMedia";

class Edit extends Component {
  static propTypes = {
    post: PropTypes.object,
    theme: PropTypes.string,
    update: PropTypes.func,
  };

  state = {
    fileExplorerOpen: false,
    pluginOperation: null, // enter the name of the plugin which is currently being overwritten.
  };

  imageInputRef = React.createRef();

  onEditorPluginBtnClick = (e, plugin) => {
    if (plugin === "plugin-image") {
      this.setState({ fileExplorerOpen: true, pluginOperation: "image" });
      return true;
    }
    if (plugin === "plugin-gallery") {
      this.setState({ fileExplorerOpen: true, pluginOperation: "gallery" });
      return true;
    }
  };

  insertMedia = urls => {
    this.editor.focus();
    if (this.state.pluginOperation === "image") {
      for (let i = 0; i < urls.length; i++) {
        this.hooks["plugin-image"].insertImage(this.editor, urls[i], "center");
        this.editor
          .moveAnchorToStartOfNextBlock()
          .moveFocusToStartOfNextBlock()
          .focus();
      }
    } else if (this.state.pluginOperation === "gallery") {
      const imgElements = [];
      for (let i = 0; i < urls.length; i++) {
        const src = urls[i];
        imgElements.push(
          new Promise(resolve => {
            let img = new Image();
            img.onload = () => {
              resolve({
                w: img.width,
                h: img.height,
                src,
              });
              URL.revokeObjectURL(src);
            };
            img.src = src;
          }),
        );
      }

      this.hooks["plugin-gallery"].createImageBlocks(imgElements, this.editor);
    }
    setTimeout(this.toggleFileExplorer, 1000);
  };

  toggleFileExplorer = () => {
    this.setState({
      fileExplorerOpen: !this.state.fileExplorerOpen,
      pluginOperation: null,
    });
  };

  onEditorChange = html => {
    PostActions.setData({
      body: html,
    });
    clearInterval(this.postSaveTimer);

    this.postSaveTimer = setTimeout(async () => {
      const data = PostActions.getData();
      EventBusInstance.publish("ARTICLE_SAVING");
      const update = await this.props.update({
        ...this.props.post,
        ...data,
      });
      EventBusInstance.publish("ARTICLE_SAVED");
      PostActions.setData({ slug: update.data.updatePost.post.slug });
    }, 1000);
  };

  uploadImage = async files => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    uploadedFiles.forEach(({ src, errors }) => {
      if (errors) return;
      this.hooks["plugin-image"].insertImage(this.editor, src, "center");
      this.editor
        .moveAnchorToStartOfNextBlock()
        .moveFocusToStartOfNextBlock()
        .focus();
    });
  };

  setEditorPluginHooks = (editor, hooks) => {
    this.hooks = hooks;
    this.editor = editor;
  };

  render() {
    const { post } = this.props;
    return (
      <StyledArticle className={post.type}>
        <div className="post-header">
          <PostTitle
            text={post.title}
            placeholder="Enter a title"
            onChange={e => {
              PostActions.setData({
                title: e.target.value,
              });
              this.onEditorChange(post.body);
            }}
          />
        </div>
        <div className="post-content">
          <LetterpadEditor
            html={post.body}
            theme={this.props.theme}
            onButtonClick={this.onEditorPluginBtnClick}
            hooks={this.setEditorPluginHooks}
            onChange={this.onEditorChange}
          />
          {this.state.fileExplorerOpen && (
            <FileExplorerModal
              isOpen={this.state.fileExplorerOpen}
              onClose={this.toggleFileExplorer}
              onMediaSelect={this.insertMedia}
              addNewMedia={() => {
                this.imageInputRef.current.click();
                this.toggleFileExplorer();
              }}
            />
          )}
        </div>
        <input
          ref={this.imageInputRef}
          className="hide post-image"
          type="file"
          multiple
          onChange={input => this.uploadImage(input.target.files)}
        />
      </StyledArticle>
    );
  }
}

export default UpdatePost(InsertMedia(Edit));
