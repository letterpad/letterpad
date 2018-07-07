// import matchBlockquote from "./match/blockquote";
import matchCodeBlock from "./match/codeBlock";
import matchCode from "./match/code";
// import matchHeader from "./match/header";
import matchBold from "./match/bold";
import matchItalic from "./match/italic";
// import matchStrikeThrough from "./match/strikethrough";
import matchBoldItalic from "./match/boldItalic";
import matchHr from "./match/hr";
import matchImage from "./match/image";
import matchLink from "./match/link";
// import matchList from "./match/list";

/**
 * On space, if it was after an auto-markdown shortcut, convert the current
 * node into the shortcut's corresponding type.
 *
 * @param {Event} event
 * @param {Change} change
 */

export const onSpace = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return;

    // const { startBlock, startOffset } = value;
    // const currentLineText = startBlock.text
    //     .slice(0, startOffset)
    //     .replace(/\s*/g, "");
    const { texts } = value;
    const currentTextNode = texts.get(0);
    const currentLineText = currentTextNode.text;
    let matched;

    if ((matched = currentLineText.match(/^\s*```(\w+)?\s/m))) {
        // [Code block]
        // ```lang
        return matchCodeBlock(
            "code_block",
            currentTextNode,
            matched,
            change,
            matched[1]
        );
    }

    const offsetBeforeSpace = value.selection.anchorOffset - 1;
    const lastChar = currentLineText.charAt(offsetBeforeSpace);
    const prevTextFromSpace = currentLineText.substr(0, offsetBeforeSpace + 1);

    // inline patterns
    if (
        (matched =
            lastChar === "`" &&
            prevTextFromSpace.match(/\s?(`|``)((?!\1).)+?\1$/m))
    ) {
        // [Code] `code`
        return matchCode("highlight", currentTextNode, matched, change);
    } else if (
        (matched = currentLineText.match(
            /!\[([^\]]+)\]\(([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?)\)/
        ))
    ) {
        // ![example](http://example.com "Optional title")
        return matchImage("image", currentTextNode, matched, change);
    } else if (
        (matched = currentLineText.match(
            /\[([^\]]+)\]\(([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?)\)/
        ))
    ) {
        // [example](http://example.com "Optional title")
        return matchLink("link", currentTextNode, matched, change);
    }

    if (lastChar === "*" || lastChar === "_") {
        if (
            (matched = prevTextFromSpace.match(
                /\s?(\*\*\*|___)((?!\1).)+?\1$/m
            ))
        ) {
            // [Bold + Italic] ***[strong + italic]***, ___[strong + italic]___
            return matchBoldItalic(
                "bolditalic",
                currentTextNode,
                matched,
                change
            );
        } else if (
            (matched = prevTextFromSpace.match(/\s?(\*\*|__)((?!\1).)+?\1$/m))
        ) {
            // [Bold] **strong**, __strong__
            return matchBold("bold", currentTextNode, matched, change);
        } else if (
            (matched = prevTextFromSpace.match(/\s?(\*|_)((?!\1).)+?\1$/m))
        ) {
            // [Italic] _em_, *em*
            return matchItalic("italic", currentTextNode, matched, change);
        }
    } else if (
        (matched = currentLineText.match(/(^\s*)([*-])(?:[\t ]*\2){2,}/m))
    ) {
        // [HR]
        // ***
        // ---
        // * * *
        // -----------
        return matchHr("line-break", currentTextNode, matched, change);
    }

    let type = getType(currentLineText);

    if (!type) return;
    if (type == "list-item" && currentTextNode.type == "list-item") return;
    event.preventDefault();

    change.setBlocks(type);

    if (type == "list-item") {
        change.wrapBlock("bulleted-list");
    }
    if (type == "ordered-list") {
        change.wrapBlock("bulleted-list");
    }

    change.extendToStartOf(currentTextNode).delete();
    return true;
};

/**
 * On backspace, if at the start of a non-paragraph, convert it back into a
 * paragraph node.
 *
 * @param {Event} event
 * @param {Change} change
 */

export const onBackspace = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return;
    if (value.startOffset != 0) return;

    const { startBlock } = value;
    if (startBlock.type == "paragraph") return;

    event.preventDefault();
    change.setBlocks("paragraph");

    if (startBlock.type == "list-item") {
        change.unwrapBlock("bulleted-list");
    }

    return true;
};

/**
 * On return, if at the end of a node type that should not be extended,
 * create a new paragraph below it.
 *
 * @param {Event} event
 * @param {Change} change
 */

export const onEnter = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return;

    const { startBlock, startOffset, endOffset } = value;
    if (startOffset == 0 && startBlock.text.length == 0)
        return onBackspace(event, change);
    if (endOffset != startBlock.text.length) return;

    if (
        startBlock.type != "heading-one" &&
        startBlock.type != "heading-two" &&
        startBlock.type != "heading-three" &&
        startBlock.type != "heading-four" &&
        startBlock.type != "heading-five" &&
        startBlock.type != "heading-six" &&
        startBlock.type != "block-quote"
    ) {
        return;
    }

    event.preventDefault();
    change.splitBlock().setBlocks("paragraph");
    return true;
};

/**
 * Get the block type for a series of auto-markdown shortcut `chars`.
 *
 * @param {String} chars
 * @return {String} block
 */

const getType = chars => {
    switch (chars) {
        case "*":
        case "-":
        case "+":
            return "list-item";
        case "1.":
            return "ordered-list";
        case ">":
            return "block-quote";
        case "#":
            return "heading-one";
        case "##":
            return "heading-two";
        case "###":
            return "heading-three";
        case "####":
            return "heading-four";
        case "#####":
            return "heading-five";
        case "######":
            return "heading-six";
        default:
            return null;
    }
};
