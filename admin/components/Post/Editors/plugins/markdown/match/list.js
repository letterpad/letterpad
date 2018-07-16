import { Range } from "slate";

export default (listOption, currentTextNode, matched, change, ordered) => {
    const matchedLength = matched[0].length;
    const newChange = change.deleteAtRange(
        Range.create({
            anchorKey: currentTextNode.key,
            focusKey: currentTextNode.key,
            anchorOffset: matched.index,
            focusOffset: matched.index + matchedLength
        })
    );

    return blocklist(newChange, {
        ...listOption,
        ordered
    });
};
