import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PostActions from "./PostActions";
const Editor = React.createClass({
    componentDidMount() {
        // this.loadEditor();
        this.loadQuillEditor();
        qEditor.root.innerHTML = this.props.body;
    },

    loadQuillEditor() {
        let that = this;
        var toolbarOptions = [
            [
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "code-block",
                "image",
                { list: "ordered" },
                { list: "bullet" },
                { script: "sub" },
                { script: "super" },
                { indent: "-1" },
                { indent: "+1" },
                { header: [1, 2, 3, 4, 5, 6, false] },
                { color: [] },
                { background: [] },
                { align: [] },
                "clean"
            ]
        ];

        window.qEditor = new Quill("#editor", {
            theme: "snow",
            placeholder: "Compose an epic...",
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: function() {
                            document.querySelector(".post-image").click();
                        }
                    }
                },
                syntax: true
            },
            scrollingContainer: "#quill-container"
        });
        qEditor.on("text-change", function() {
            var justHtml = qEditor.root.innerHTML;
            PostActions.setData({
                body: justHtml
            });
        });
        qEditor.root.innerHTML = this.props.body;
    },

    uploadImage(files) {
        PostActions.uploadFile(files, this.props.insertMedia).then(
            post_image => {
                var Delta = qEditor.constructor.import("delta");
                qEditor.updateContents(
                    new Delta()
                        .retain(qEditor.selection.savedRange.index)
                        .insert({
                            image: post_image
                        })
                );
            }
        );
    },
    render() {
        return (
            <div id="quill-container">
                <div id="editor" className="editor" />
                <input
                    ref={input => (this.imageInput = input)}
                    className="hide post-image"
                    type="file"
                    onChange={input => this.uploadImage(input.target.files)}
                />
            </div>
        );
    }
});
const insertMediaQuery = gql`
    mutation insertMedia($url: String!) {
        insertMedia(url: $url) {
            url
        }
    }
`;
const insertMedia = graphql(insertMediaQuery, {
    props: ({ mutate }) => {
        return {
            insertMedia: data => {
                mutate({
                    variables: data
                });
            }
        };
    }
});
export default insertMedia(Editor);
