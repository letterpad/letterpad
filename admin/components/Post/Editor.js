import React, { Component } from "react";
import PropTypes from "prop-types";
import Html from "slate-html-serializer";
// import MarkdownEditor from "./Editors/MarkdownEditor";
import { SlateContent, SlateEditor, TextMenu } from "./Editors/SlateEditor";
import InsertMedia from "../../data-connectors/InsertMedia";
import { BoldPlugin, BoldButton } from "./Editors/plugins/bold";
import { ItalicPlugin, ItalicButton } from "./Editors/plugins/italic";
import { UnderlinePlugin, UnderlineButton } from "./Editors/plugins/underline";
import { HighlightPlugin, HighlightButton } from "./Editors/plugins/highlight";
import { ListPlugin, ListButtonBar } from "./Editors/plugins/list";
import { ImageButton, ImagePlugin } from "./Editors/plugins/image";
import ToolBar from "./Editors/SlateEditor/ToolBar";
import rules from "./Editors/helper/rules";
import PostActions from "./PostActions";
import { LinkPlugin, LinkButton } from "./Editors/plugins/link";
import { MarkdownPlugin } from "./Editors/plugins/markdown";
import { HeadingsPlugin, HeadingsButton } from "./Editors/plugins/headings";
import { LinebreakPlugin, LinebreakButton } from "./Editors/plugins/linebreak";
import {
    BlockquoteButton,
    BlockquotePlugin
} from "./Editors/plugins/blockquote";
// import PluginEditCode from "slate-edit-code";
import PluginPrism from "slate-prism";
import { CodeblockButton } from "./Editors/plugins/codeblock";

const html = new Html({ rules });

// Apply plugins
const plugins = [
    PluginPrism({
        onlyIn: node => node.type === "code_block",
        getSyntax: node => node.data.get("syntax")
    }),
    // PluginEditCode({
    //     onlyIn: node => node.type === "code_block"
    // }),
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
    BlockquotePlugin()
];

class Editor extends Component {
    static propTypes = {
        insertMedia: PropTypes.func,
        body: PropTypes.string,
        mdBody: PropTypes.string,
        isMarkdown: PropTypes.any
    };

    state = {
        value: html.deserialize(this.props.body) // Value.fromJSON(initialEditorState)
    };

    menuRef = React.createRef();

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

    onEditorChange = value => {
        if (value.document != this.state.value.document) {
            const string = html.serialize(value);
            PostActions.setData({
                body: string
            });
        }
        this.setState({ value: value });
    };

    render() {
        return (
            <React.Fragment>
                <SlateEditor
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onEditorChange}
                >
                    <TextMenu menuRef={this.menuRef} value={this.state.value}>
                        <BoldButton />
                        <ItalicButton />
                        <UnderlineButton />
                        <BlockquoteButton type="block-quote" />
                        <HeadingsButton type="heading-two" />
                        <HeadingsButton type="heading-three" />
                        <ListButtonBar />
                        <LinkButton />
                    </TextMenu>
                    <SlateContent />
                    <ToolBar value={this.state.value}>
                        <ImageButton />
                        <HighlightButton />
                        <HeadingsButton type="heading-four" />
                        <HeadingsButton type="heading-five" />
                        <HeadingsButton type="heading-six" />
                        <LinebreakButton />
                        <CodeblockButton />
                    </ToolBar>
                </SlateEditor>
            </React.Fragment>
        );
    }
}

export default InsertMedia(Editor);
