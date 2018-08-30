/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { getEventTransfer } from "slate-react";
import Html from "slate-html-serializer";

import InsertMedia from "../../../data-connectors/InsertMedia";
import UpdatePost from "../../../data-connectors/UpdatePost";

import { EventBusInstance } from "../../../../shared/eventBus";
import PostActions from "../PostActions";
import ToolBar from "./slatejs/ToolBar";
import rules from "./helper/rules";

import { SlateContent, SlateEditor, TextMenu } from "./slatejs";
import { BoldPlugin, BoldButton } from "./plugins/bold";
import { ItalicPlugin, ItalicButton } from "./plugins/italic";
import { UnderlinePlugin, UnderlineButton } from "./plugins/underline";
import { HighlightPlugin, HighlightButton } from "./plugins/highlight";
import { ListPlugin, ListButtonBar } from "./plugins/list";
import { ImageButton, ImagePlugin } from "./plugins/image";
import { LinkPlugin, LinkButton } from "./plugins/link";
import { MarkdownPlugin } from "./plugins/markdown";
import { HeadingsPlugin, HeadingsButton } from "./plugins/headings";
import { LinebreakPlugin, LinebreakButton } from "./plugins/linebreak";
import { BlockquotePlugin, BlockquoteButton } from "./plugins/blockquote";
import PluginPrism from "slate-prism";
import { CodeblockPlugin, CodeblockButton } from "./plugins/codeblock";
import styled from "styled-components";
import { AutoScrollPlugin } from "./plugins/autoscroll";
import scrollToCursor from "./helper/scrollToCursor";

const html = new Html({ rules });

const StyledMenu = styled(TextMenu)`
    padding: 8px 7px 6px;
    position: absolute;
    z-index: 1;
    top: -10000px;
    left: -10000px;
    margin-top: -6px;
    opacity: 0;
    background-color: var(--bg-sections);
    border-radius: 4px;
    transition: opacity 0.75s;

    > * + * {
        margin-left: 8px;
    }
    .button {
        cursor: pointer;
        .material-icons {
            font-size: 15px;
            padding: 2px;
        }
    }
`;

const StyledToolBar = styled(ToolBar)`
    > * {
        display: inline-block;
    }
    > * + * {
        margin-left: 8px;
    }
    .button {
        color: #ccc;
        cursor: pointer;
        .material-icons {
            font-size: 15px;
            vertical-align: text-bottom;
            padding: 2px 4px;
        }
    }
`;

const StyledContent = styled(SlateContent)`
    font-size: 18px;
    line-height: 1.8;
    hr {
        border: none !important;
        margin-top: 52px;
        margin-bottom: 42px;
        display: block;
        border: 0;
        text-align: center;
        overflow: visible;
        &:before {
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
            font-weight: 400;
            font-style: italic;
            font-size: 30px;
            letter-spacing: 0.6em;
            content: "...";
            display: inline-block;
            margin-left: 0.6em;
            color: var(--color-base);
            position: relative;
            top: -30px;
        }
    }
`;

// Apply plugins
const plugins = [
    PluginPrism({
        onlyIn: node => node.type === "code_block",
        getSyntax: node => node.data.get("syntax")
    }),
    CodeblockPlugin(),
    HeadingsPlugin(),
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
    HighlightPlugin(),
    ListPlugin(),
    ImagePlugin(),
    LinkPlugin(),
    LinebreakPlugin(),
    MarkdownPlugin(),
    BlockquotePlugin(),
    AutoScrollPlugin()
];

class Editor extends Component {
    static propTypes = {
        insertMedia: PropTypes.func,
        post: PropTypes.object,
        update: PropTypes.func
    };

    state = {
        value: html.deserialize(this.props.post.body)
    };

    menuRef = React.createRef();

    componentDidMount = () => {
        this.updateMenu();
        document.addEventListener("keyup", this.hideMenu);
    };

    componentWillUnmount() {
        document.removeEventListener("keyup", this.hideMenu);
    }

    componentDidUpdate = () => {
        this.updateMenu();
    };

    hideMenu = e => {
        if (e.keyCode === 27) {
            this.menuRef.current.removeAttribute("style");
        }
    };
    /**
     * Update the menu's absolute position.
     */

    updateMenu = () => {
        const { value } = this.state;

        // disable formatting options for code blocks
        let parentNode = value.anchorBlock;
        const menu = this.menuRef.current;
        if (parentNode) {
            do {
                if (parentNode.type === "code_block") {
                    return menu.removeAttribute("style");
                }
            } while ((parentNode = value.document.getParent(parentNode.key)));
        }
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

    onEditorChange = value => {
        if (value.document != this.state.value.document) {
            const string = html.serialize(value);
            PostActions.setData({
                body: string
            });
            clearInterval(this.postSaveTimer);

            this.postSaveTimer = setTimeout(async () => {
                const data = PostActions.getData();
                EventBusInstance.publish("ARTICLE_SAVING");
                const update = await this.props.update({
                    ...this.props.post,
                    ...data
                });
                EventBusInstance.publish("ARTICLE_SAVED");
                PostActions.setData({ slug: update.data.updatePost.post.slug });
            }, 1000);
        }
        this.setState({ value: value });
    };

    onPaste = (event, change) => {
        scrollToCursor();
        const transfer = getEventTransfer(event);
        if (transfer.type != "html") return;
        const { document } = html.deserialize(transfer.html);
        change.insertFragment(document);
        return true;
    };

    render() {
        return (
            <React.Fragment>
                <SlateEditor
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onEditorChange}
                    onPaste={this.onPaste}
                >
                    <StyledMenu menuRef={this.menuRef}>
                        <BoldButton />
                        <ItalicButton />
                        <UnderlineButton />
                        <BlockquoteButton />
                        <LinkButton />
                        <HeadingsButton type="heading-two" />
                        <HeadingsButton type="heading-three" />
                        <ListButtonBar />
                    </StyledMenu>
                    <StyledContent />
                    <StyledToolBar value={this.state.value}>
                        <ImageButton />
                        <HighlightButton />
                        <HeadingsButton type="heading-four" />
                        <HeadingsButton type="heading-five" />
                        <HeadingsButton type="heading-six" />
                        <LinebreakButton />
                        <CodeblockButton />
                    </StyledToolBar>
                </SlateEditor>
            </React.Fragment>
        );
    }
}

export default UpdatePost(InsertMedia(Editor));
