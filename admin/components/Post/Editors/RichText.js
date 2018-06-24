import React, { Component } from "react";
import PostActions from "../PostActions";
import PropTypes from "prop-types";
import FileExplorerModal from "../../../components/Modals/FileExplorerModal";
import { uploadFile } from "../../../util";

class RichText extends Component {
    static propTypes = {
        insertMedia: PropTypes.func.isRequired,
        body: PropTypes.string.isRequired
    };
    constructor(props) {
        super(props);
        this.toggleFileExplorer = this.toggleFileExplorer.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.state = {
            fileExplorerOpen: false
        };
    }
    componentDidMount() {
        this.loadQuillEditor();
        qEditor.root.innerHTML = this.props.body;
    }

    loadQuillEditor() {
        var toolbarOptions = [
            [
                "bold",
                "italic",
                "underline",
                "blockquote",
                "code-block",
                "image",
                { list: "ordered" },
                { list: "bullet" },
                { header: [1, 2, 3, 4, 5, 6, false] },
                { color: [] },
                { background: [] },
                { align: [] },
                "clean"
            ]
        ];
        let _this = this;
        window.qEditor = new Quill("#editor", {
            theme: "snow",
            placeholder: "Compose an epic...",
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: () => {
                            //document.querySelector(".post-image").click();
                            _this.toggleFileExplorer();
                        }
                    }
                },
                syntax: true
            }
        });
        qEditor.on("text-change", function() {
            var justHtml = qEditor.root.innerHTML;
            // add extra class
            justHtml = justHtml.replace('"ql-syntax"', '"ql-syntax hljs"');
            PostActions.setData({
                body: justHtml
            });
        });
        qEditor.root.innerHTML = this.props.body;
    }

    // upload new images and update the post
    async uploadImage(files) {
        const uploadedFiles = await uploadFile({ files, type: "post_image" });
        var Delta = qEditor.constructor.import("delta");
        uploadedFiles.forEach(post_image => {
            qEditor.updateContents(
                new Delta()
                    .retain(qEditor.selection.savedRange.index)
                    .insert({
                        image: post_image
                    })
                    .insert("\n\n")
            );
        });
    }

    // insert an existing image from the media gallery
    insertImage(post_image) {
        this.toggleFileExplorer();
        var Delta = qEditor.constructor.import("delta");
        qEditor.updateContents(
            new Delta()
                .retain(qEditor.selection.savedRange.index)
                .insert({
                    image: post_image
                })
                .insert("\n\n")
        );
    }

    toggleFileExplorer() {
        this.setState({ fileExplorerOpen: !this.state.fileExplorerOpen });
    }
    render() {
        return (
            <div id="quill-container">
                <div id="editor" className="editor" />
                <input
                    ref={input => (this.imageInput = input)}
                    className="hide post-image"
                    type="file"
                    multiple
                    onChange={input => this.uploadImage(input.target.files)}
                />
                {this.state.fileExplorerOpen && (
                    <FileExplorerModal
                        onClose={this.toggleFileExplorer}
                        onMediaSelect={this.insertImage}
                        addNewMedia={() => {
                            document.querySelector(".post-image").click();
                            this.toggleFileExplorer();
                        }}
                    />
                )}
            </div>
        );
    }
}

export default RichText;
