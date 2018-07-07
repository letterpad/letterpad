import React from "react";
import classnames from "classnames";
import { Editor } from "slate-react";

//
// Nodes
//
// import { AlignmentNode } from "@slate-editor/alignment-plugin";
// import { EmbedNode } from "@slate-editor/embed-plugin";
// import { GridNode, GridRowNode, GridCellNode } from "@slate-editor/grid-plugin";
import { ImageNode } from "../plugins/image";
// import { LinkNode } from "@slate-editor/link-plugin";
import {
    ListItemNode,
    OrderedListNode,
    UnorderedListNode
} from "../plugins/list";

//
// Marks
//
import { BoldMark } from "../plugins/bold";
import { ItalicMark } from "../plugins/italic";
import { UnderlineMark } from "../plugins/underline";
import { HighlightMark } from "../plugins/highlight";
import { LinkNode } from "../plugins/link";
// import MarkdownNode from "../plugins/markdown/MarkdownNode";
import BlockquoteNode from "../plugins/blockquote/BlockquoteNode";
// import { HeadingsNode } from "../plugins/headings";
// import { MarkdownNode } from "../plugins/markdown";
import LinebreakNode from "../plugins/linebreak/LinebreakNode";
import { HeadingsNode } from "../plugins/headings";
import { CodeblockNode } from "../plugins/codeblock";
import { decorateNode } from "../plugins/codeblock/CodeblockUtils";

/* eslint-disable default-case */
export const renderNode = props => {
    switch (props.node.type) {
        // case "alignment":
        //     return <AlignmentNode {...props} />;
        // case "embed":
        //     return <EmbedNode {...props} />;
        // case "grid":
        //     return <GridNode {...props} />;
        // case "grid-row":
        //     return <GridRowNode {...props} />;
        // case "grid-cell":
        //     return <GridCellNode {...props} />;
        case "code_block":
            return <CodeblockNode {...props} />;
        case "line-break":
            return <LinebreakNode {...props} />;
        case "image":
            return <ImageNode {...props} />;
        case "block-quote":
            return <BlockquoteNode {...props} />;
        case "heading-one":
            return <HeadingsNode {...props} />;
        case "heading-two":
            return <HeadingsNode {...props} />;
        case "heading-three":
            return <HeadingsNode {...props} />;
        case "heading-four":
            return <HeadingsNode {...props} />;
        case "heading-five":
            return <HeadingsNode {...props} />;
        case "heading-six":
            return <HeadingsNode {...props} />;
        // case "imageLink":
        //     return <ImageLinkNode {...props} />;
        case "link":
            return <LinkNode {...props} />;
        case "list-item":
            return <ListItemNode {...props} />;
        case "ordered-list":
            return <OrderedListNode {...props} />;
        case "unordered-list":
            return <UnorderedListNode {...props} />;
    }
};

export const renderMark = props => {
    switch (props.mark.type) {
        case "bold":
            return <BoldMark {...props} />;
        case "highlight":
            return <HighlightMark {...props} />;
        case "italic":
            return <ItalicMark {...props} />;
        case "underline":
            return <UnderlineMark {...props} />;
    }
};
/* eslint-disable react/prop-types */

export default ({
    className,
    wrapperStyle,
    style,
    value,
    outerState,
    plugins,
    onChange,
    children,
    ...rest
}) => {
    const { readOnly } = outerState;

    return (
        <div
            className={classnames("editor--content", className)}
            style={wrapperStyle}
        >
            <Editor
                plugins={plugins}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                outerState={outerState}
                style={style}
                renderNode={renderNode}
                renderMark={renderMark}
                decorateNode={decorateNode}
                {...rest}
            />
            {children}
        </div>
    );
};
