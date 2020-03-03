import React, { Component } from "react";

import { EventBusInstance } from "../../../shared/eventBus";
import FileExplorerModal from "../modals/FileExplorerModal";
import LetterpadEditor from "letterpad-editor";
import PostActions from "./PostActions";
import PostTitle from "./PostTitle";
import StyledArticle from "./Article.css";
import { createGlobalStyle } from "styled-components";
import { uploadFile } from "../../server/util";

class Edit extends Component<any> {
  postSaveTimer: number = 0;
  hooks: any = null;
  editor: any = null;

  state = {
    fileExplorerOpen: false,
    pluginOperation: null, // enter the name of the plugin which is currently being overwritten.
  };

  imageInputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    PostActions.setData(this.props.post);
  }

  onMediaBrowse = () => {
    this.setState({ fileExplorerOpen: true });
  };

  insertMedia = urls => {
    urls.forEach(url => {
      this.editor.insertImageUrl(url);
    });

    setTimeout(this.toggleFileExplorer, 1000);
  };

  toggleFileExplorer = () => {
    this.setState({
      fileExplorerOpen: !this.state.fileExplorerOpen,
      pluginOperation: null,
    });
  };

  onEditorChange = async change => {
    const { markdown, html } = change();
    if (markdown === PostActions.getData().md) return null;
    PostActions.setData({
      html,
      md: markdown,
    });
    clearInterval(this.postSaveTimer);
    this.postSaveTimer = setTimeout(async () => {
      EventBusInstance.publish("ARTICLE_SAVING");
      const update = await this.props.updatePost();
      if (
        update.data &&
        update.data.updatePost &&
        update.data.updatePost.post
      ) {
        EventBusInstance.publish("ARTICLE_SAVED");
        PostActions.setData({ slug: update.data.updatePost.post.slug });
      }
    }, 1000);
  };

  uploadImage = async files => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    return uploadedFiles[0].src;
  };

  uploadAndInsert = async files => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    uploadedFiles.forEach(item => {
      this.editor.insertImageUrl(item.src);
    });
  };

  onBeforeRender = editor => {
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
            onChange={(value: string) => {
              PostActions.setData({
                title: value,
              });
              // this.onEditorChange(post.md);
            }}
          />
        </div>
        <div className="post-content">
          <PrismStyles />
          <br />
          <br />
          <LetterpadEditor
            onImageBrowse={this.onMediaBrowse}
            getEditorInstance={this.onBeforeRender}
            uploadImage={(file: File) => this.uploadImage([file])}
            defaultValue={post.md}
            onChange={this.onEditorChange}
            placeholder="Write a story.."
          />
          {this.state.fileExplorerOpen && (
            <FileExplorerModal
              isOpen={this.state.fileExplorerOpen}
              onClose={this.toggleFileExplorer}
              onMediaSelect={this.insertMedia}
              addNewMedia={() => {
                if (this.imageInputRef.current) {
                  this.imageInputRef.current.click();
                }
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
          onChange={input => this.uploadAndInsert(input.target.files)}
        />
      </StyledArticle>
    );
  }
}

export default Edit;

/*
Based on Prism template by Bram de Haan (http://atelierbram.github.io/syntax-highlighting/prism/)
Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)
*/
const PrismStyles = createGlobalStyle`
  code[class*="language-"],
  pre[class*="language-"] {
    -webkit-font-smoothing: initial;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 13px;
    line-height: 1.375;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    color: #24292e;
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6a737d;
  }

  .token.punctuation {
    color: #5e6687;
  }

  .token.namespace {
    opacity: .7;
  }

  .token.operator,
  .token.boolean,
  .token.number {
    color: #d73a49;
  }

  .token.property {
    color: #c08b30;
  }

  .token.tag {
    color: #3d8fd1;
  }

  .token.string {
    color: #032f62;
  }

  .token.selector {
    color: #6679cc;
  }

  .token.attr-name {
    color: #c76b29;
  }

  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #22a2c9;
  }

  .token.attr-value,
  .token.keyword,
  .token.control,
  .token.directive,
  .token.unit {
    color: #d73a49;
  }

  .token.function {
    color: #6f42c1;
  }

  .token.statement,
  .token.regex,
  .token.atrule {
    color: #22a2c9;
  }

  .token.placeholder,
  .token.variable {
    color: #3d8fd1;
  }

  .token.deleted {
    text-decoration: line-through;
  }

  .token.inserted {
    border-bottom: 1px dotted #202746;
    text-decoration: none;
  }

  .token.italic {
    font-style: italic;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.important {
    color: #c94922;
  }

  .token.entity {
    cursor: help;
  }

  pre > code.highlight {
    outline: 0.4em solid #c94922;
    outline-offset: .4em;
  }
`;
