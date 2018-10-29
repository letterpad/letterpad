import React, { Component } from "react";
import styled from "styled-components";

const CodeblockContainer = styled.div`
  position: relative;
`;

const CodeblockLang = styled.div`
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 14px;
  padding: 4px;
  background-color: transparent;
  color: #555;
  border-radius: 3px;
  text-transform: uppercase;
`;

/* eslint-disable react/prop-types */
class CodeblockNode extends Component {
  state = {
    language: this.props.node.data.get("language") || "js",
  };

  onChange = event => {
    const { node, editor } = this.props;
    this.setState({ language: event.target.value });
    editor.change(c =>
      c.setNodeByKey(node.key, { data: { language: event.target.value } }),
    );
  };

  render() {
    const { attributes, children } = this.props;
    return (
      <CodeblockContainer>
        <pre className="prism-dark" {...attributes} data-language="javascript">
          {children}
        </pre>
        <CodeblockLang contentEditable={false}>
          <select value={this.state.language} onChange={this.onChange}>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
            <option value="html">HTML</option>
          </select>
        </CodeblockLang>
      </CodeblockContainer>
    );
  }
}

export default CodeblockNode;
