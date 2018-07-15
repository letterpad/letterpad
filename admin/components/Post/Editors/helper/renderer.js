/* eslint-disable react/prop-types */
import React from "react";
// Nodes
import { ImageNode } from "../plugins/image";
import { LinkNode } from "../plugins/link";
import { BlockquoteNode } from "../plugins/blockquote";
import { LinebreakNode } from "../plugins/linebreak";
import { HeadingsNode } from "../plugins/headings";
import { CodeblockNode } from "../plugins/codeblock";
import {
    ListItemNode,
    OrderedListNode,
    UnorderedListNode
} from "../plugins/list";

// Marks
import { BoldMark } from "../plugins/bold";
import { ItalicMark } from "../plugins/italic";
import { UnderlineMark } from "../plugins/underline";
import { HighlightMark } from "../plugins/highlight";

export const nodeRenderer = (type, props) => {
    switch (type) {
        case "code_block":
            return <CodeblockNode {...props} />;
        case "line-break":
            return <LinebreakNode {...props} />;
        case "image":
            return <ImageNode {...props} />;
        case "block-quote":
            return <BlockquoteNode {...props} />;
        case "heading-one":
        case "heading-two":
        case "heading-three":
        case "heading-four":
        case "heading-five":
        case "heading-six":
            return <HeadingsNode {...props} />;
        case "link":
            return <LinkNode {...props} />;
        case "list-item":
            return <ListItemNode {...props} />;
        case "ordered-list":
            return <OrderedListNode {...props} />;
        case "unordered-list":
            return <UnorderedListNode {...props} />;
        case "paragraph":
            return <p {...props.attributes}>{props.children}</p>;
    }
};

export const markRenderer = (type, props) => {
    switch (type) {
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
