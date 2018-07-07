// @flow
import { Range } from "slate";
// import { Change, Node } from "slate";

export default function(type, currentTextNode, matched, change) {
    const matchedLength = matched[0].length;

    return change
        .deleteAtRange(
            Range.create({
                anchorKey: currentTextNode.key,
                focusKey: currentTextNode.key,
                anchorOffset: matched.index,
                focusOffset: matched.index + matchedLength
            })
        )
        .insertBlock({
            type,
            isVoid: true,
            data: {
                src: matched[2],
                alt: matched[1]
            }
        })
        .collapseToStartOfNextText();
}
