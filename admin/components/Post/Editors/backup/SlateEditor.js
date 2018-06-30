import { Editor, getEventRange, getEventTransfer } from "slate-react";
import { Block } from "slate";
import PropTypes from "prop-types";
import React from "react";
import { LAST_CHILD_TYPE_INVALID } from "slate-schema-violations";
import Html from "slate-html-serializer";
import isUrl from "is-url";

import { uploadFile } from "../../../util";
import PostActions from "../PostActions";
import rules from "./rules";
import { isImage } from "./utils";
import TextMenu from "./components/TextMenu";
import ToolBar from "./components/ToolBar";
/*
 * Html data needs to be serialized to be used in editor.
 * Also while saving, it needs to be deserialized to html
 */

const html = new Html({ rules });

/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Range} target
 */

function insertImage(change, src, target) {
    if (target) {
        change.select(target);
    }

    change
        .insertBlock({
            type: "image",
            isVoid: true,
            data: { src }
        })
        .insertBlock("\n\n");
}

/**
 * A schema to enforce that there's always a paragraph as the last block.
 *
 * @type {Object}
 */

const schema = {
    document: {
        last: { types: ["paragraph"] },
        normalize: (change, reason, { node }) => {
            switch (reason) {
                case LAST_CHILD_TYPE_INVALID: {
                    const paragraph = Block.create("paragraph");
                    return change.insertNodeByKey(
                        node.key,
                        node.nodes.size,
                        paragraph
                    );
                }
            }
        }
    }
};

/**
 * The Editor.
 *
 * @type {Component}
 */

class SlateEditor extends React.Component {
    static propTypes = {
        body: PropTypes.string.isRequired
    };

    static defaultProps = {
        body: ""
    };

    /**
     * Deserialize the html.
     *
     * @type {Object}
     */

    state = {
        value: html.deserialize(this.props.body)
    };

    menuRef = React.createRef();
    imageInputRef = React.createRef();
    /**
     * On update, update the menu.
     */

    componentDidMount = () => {
        this.updateMenu();
    };

    componentDidUpdate = () => {
        this.updateMenu();
    };

    /**
     * Update the menu's absolute position.
     */

    updateMenu = () => {
        const { value } = this.state;
        const menu = this.menuRef.current;
        if (!menu) return;

        if (value.isBlurred || value.isEmpty) {
            menu.removeAttribute("style");
            return;
        }

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        menu.style.opacity = 1;
        menu.style.top = `${rect.top +
            window.pageYOffset -
            menu.offsetHeight}px`;

        menu.style.left = `${rect.left +
            window.pageXOffset -
            menu.offsetWidth / 2 +
            rect.width / 2}px`;
    };

    /**
     * On change.
     *
     * @param {Change} change
     */

    onEditorChange = props => {
        if (props.value.document != this.state.value.document) {
            const string = html.serialize(props.value);
            PostActions.setData({
                body: string
            });
        }
        this.setState({ value: props.value });
    };

    // upload new images and update the post
    uploadImage = async files => {
        const uploadedFiles = await uploadFile({ files, type: "post_image" });

        uploadedFiles.forEach(post_image => {
            const change = this.state.value
                .change()
                .call(insertImage, post_image);

            this.onEditorChange(change);
        });
    };

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderMark = props => {
        const { children, mark, attributes, node } = props;

        switch (mark.type) {
            case "bold":
                return <strong {...attributes}>{children}</strong>;
            case "code":
                return <code {...attributes}>{children}</code>;
            case "pre":
                return <pre {...attributes}>{children}</pre>;
            case "italic":
                return <em {...attributes}>{children}</em>;
            case "underline":
                return <u {...attributes}>{children}</u>;
            case "link": {
                const { data } = node;
                const href = data.get("href");
                return (
                    <a {...attributes} href={href}>
                        {children}
                    </a>
                );
            }
        }
    };

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderNode = props => {
        const { attributes, node, isSelected } = props;
        switch (node.type) {
            case "image": {
                const src = node.data.get("src");
                const className = isSelected ? "active" : null;
                const style = { display: "block" };
                return (
                    <img
                        src={src}
                        className={className}
                        style={style}
                        {...attributes}
                    />
                );
            }
        }
    };

    /**
     * On drop, insert the image wherever it is dropped.
     *
     * @param {Event} event
     * @param {Change} change
     * @param {Editor} editor
     */

    onDropOrPaste = (event, change, editor) => {
        const target = getEventRange(event, change.value);
        if (!target && event.type == "drop") return;

        const transfer = getEventTransfer(event);
        const { type, text, files } = transfer;

        if (type == "files") {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split("/");
                if (mime != "image") continue;

                reader.addEventListener("load", () => {
                    editor.change(c => {
                        c.call(insertImage, reader.result, target);
                    });
                });

                reader.readAsDataURL(file);
            }
        }

        if (type == "text") {
            if (!isUrl(text)) return;
            if (!isImage(text)) return;
            change.call(insertImage, text, target);
        }
    };

    /**
     * Render.
     *
     * @return {Element}
     */

    render() {
        return (
            <React.Fragment>
                <TextMenu
                    menuRef={this.menuRef}
                    value={this.state.value}
                    onChange={this.onEditorChange}
                />
                <ToolBar
                    insertImage={insertImage}
                    uploadImage={this.uploadImage}
                    value={this.state.value}
                    onChange={this.onEditorChange}
                />
                <div className="editor m-b-100">
                    <Editor
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onEditorChange}
                        renderMark={this.renderMark}
                        schema={schema}
                        renderNode={this.renderNode}
                        onDrop={this.onDropOrPaste}
                        onPaste={this.onDropOrPaste}
                    />
                </div>
            </React.Fragment>
        );
    }
}

/**
 * Export.
 */

export default SlateEditor;
