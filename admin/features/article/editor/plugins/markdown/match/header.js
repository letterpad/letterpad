import { Range } from "slate";

export default (type, currentTextNode, matched, change) => {
    const matchedLength = matched[0].length;
    const count = (matched[0].match(/#/g) || []).length;
    let header;

    if (count === 1) header = "heading_one";
    else if (count === 2) header = "heading_two";
    else if (count === 3) header = "heading_three";
    else if (count === 4) header = "heading_four";
    else if (count === 5) header = "heading_five";
    else if (count === 6) header = "heading_six";
    else return;

    return change.setBlocks(header).deleteAtRange(
        Range.create({
            anchorKey: currentTextNode.key,
            focusKey: currentTextNode.key,
            anchorOffset: matched.index,
            focusOffset: matched.index + matchedLength
        })
    );
};
