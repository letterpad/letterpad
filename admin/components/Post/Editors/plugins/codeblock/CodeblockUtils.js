import Prism from "prismjs";

export const hasBlock = (value, type) => {
    return value.blocks.some(node => node.type == type);
};

export const applyCodeblock = change => {
    return change.wrapBlock("code_block");
};

export const decorateNode = node => {
    if (node.type != "code_block") return;
    let language = "javascript";
    if (node.data.get("language")) {
        language = node.data.get("language");
    }
    const grammar = Prism.languages[language];
    const texts = node.getTexts().toArray();

    // Tokenize the whole block text
    // const texts = block.getTexts();
    const blockText = texts.map(t => t.text).join("\n");
    const tokens = Prism.tokenize(blockText, grammar);

    // The list of decorations to return
    const decorations = [];
    let textStart = 0;
    let textEnd = 0;

    texts.forEach(text => {
        textEnd = textStart + text.text.length;

        let offset = 0;

        function processToken(token, accu) {
            accu = accu || "";

            if (typeof token === "string") {
                if (accu) {
                    const decoration = createDecoration({
                        text,
                        textStart,
                        textEnd,
                        start: offset,
                        end: offset + token.length,
                        className: `prism-token token ${accu}`
                    });
                    if (decoration) {
                        decorations.push(decoration);
                    }
                }
                offset += token.length;
            } else {
                accu = `${accu} ${token.type} ${token.alias || ""}`;

                if (typeof token.content === "string") {
                    const decoration = createDecoration({
                        text,
                        textStart,
                        textEnd,
                        start: offset,
                        end: offset + token.content.length,
                        className: `prism-token token ${accu}`
                    });
                    if (decoration) {
                        decorations.push(decoration);
                    }

                    offset += token.content.length;
                } else {
                    // When using token.content instead of token.matchedStr, token can be deep
                    for (let i = 0; i < token.content.length; i += 1) {
                        processToken(token.content[i], accu);
                    }
                }
            }
        }

        tokens.forEach(processToken);
        textStart = textEnd + 1; // account for added `\n`
    });

    return decorations;
};
/**
 * Return a decoration range for the given text.
 */
function createDecoration({ text, textStart, textEnd, start, end, className }) {
    if (start >= textEnd || end <= textStart) {
        // Ignore, the token is not in the text
        return null;
    }

    // Shrink to this text boundaries
    start = Math.max(start, textStart);
    end = Math.min(end, textEnd);

    // Now shift offsets to be relative to this text
    start -= textStart;
    end -= textStart;

    return {
        anchorKey: text.key,
        anchorOffset: start,
        focusKey: text.key,
        focusOffset: end,
        marks: [{ type: "prism-token", data: { className } }]
    };
}
