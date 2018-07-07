/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
export default function(type, currentTextNode, matched, change) {
    return change
        .removeNodeByKey(currentTextNode.key)
        .insertBlock({
            type,
            isVoid: true
        })
        .collapseToStartOfNextBlock();
}
