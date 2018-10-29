import React from "react";
import classnames from "classnames";
import { Editor } from "slate-react";
import { Block } from "slate";
import { LAST_CHILD_TYPE_INVALID } from "slate-schema-violations";

import { decorateNode } from "../plugins/codeblock/CodeblockUtils";
import { nodeRenderer, markRenderer } from "../helper/renderer";

/* eslint-disable default-case */
export const renderNode = props => {
  return nodeRenderer(props.node.type, props);
};

export const renderMark = props => {
  return markRenderer(props.mark.type, props);
};

/**
 * A schema to enforce that there's always a paragraph as the last block.
 * @type {Object}
 */

const schema = {
  document: {
    last: { types: ["paragraph"] },
    normalize: (change, reason, { node }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Block.create("paragraph");
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    },
  },
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
  onPaste,
  ...rest
}) => {
  const { readOnly } = outerState;

  return (
    <div
      className={classnames("editor--content", className)}
      style={wrapperStyle}
    >
      <Editor
        schema={schema}
        plugins={plugins}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        readOnly={readOnly}
        outerState={outerState}
        style={style}
        renderNode={renderNode}
        renderMark={renderMark}
        decorateNode={decorateNode}
        placeholder="Compose a story.."
        {...rest}
      />
      {children}
    </div>
  );
};
