//import matchCodeBlock from "./match/codeBlock";
import matchCode from "./match/code";
import matchBold from "./match/bold";
import matchItalic from "./match/italic";
import matchBoldItalic from "./match/boldItalic";
import matchHr from "./match/hr";
import matchImage from "./match/image";
import matchLink from "./match/link";

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

    const { texts } = value;
    const currentTextNode = texts.get(0);
    const currentLineText = currentTextNode.text;
    let matched;

    // if ((matched = currentLineText.match(/^\s*```(\w+)?\s/m))) {
    //     // [Code block]
    //     // ```lang
    //     return matchCodeBlock(
    //         "code_block",
    //         currentTextNode,
    //         matched,
    //         change,
    //         matched[1]
    //     );
    // }

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

    // if (change.value.blocks.get(0).type !== "paragraph") return;
    let type = getType(currentLineText);

    if (!type) return;
    if (type == "list-item" && currentTextNode.type == "list-item") return;
    event.preventDefault();

    if (type == "unordered-list") {
        change.setBlocks("list-item");
        change.wrapBlock("unordered-list");
    } else if (type == "ordered-list") {
        change.setBlocks("list-item");
        change.wrapBlock("ordered-list");
    } else {
        change.setBlocks(type);
    }
    change.extendToStartOf(currentTextNode).delete();
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
            return "unordered-list";
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
