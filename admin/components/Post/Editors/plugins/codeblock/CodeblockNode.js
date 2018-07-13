import React from "react";
import styled from "styled-components";

const CodeblockContainer = styled.div`
    position: relative;
`;

// const CodeblockLang = styled.div`
//     position: absolute;
//     right: 2px;
//     top: 2px;
//     font-size: 14px;
//     padding: 4px;
//     background-color: #eee;
//     color: #555;
//     border-radius: 3px;
//     text-transform: uppercase;
// `;

/* eslint-disable react/prop-types */
const CodeblockNode = ({ attributes, children, node, editor }) => {
    const language = "js"; //node.data.get("language");
    function onChange(event) {
        editor.change(c =>
            c.setNodeByKey(node.key, { data: { language: event.target.value } })
        );
    }

    return (
        <CodeblockContainer>
            <pre className="prism-dark">
                <code {...attributes}>{children}</code>
            </pre>
            <div
                contentEditable={false}
                style={{ position: "absolute", top: "5px", right: "5px" }}
            >
                <select value={language} onChange={onChange}>
                    <option value="css">CSS</option>
                    <option value="js">JavaScript</option>
                    <option value="html">HTML</option>
                </select>
            </div>
        </CodeblockContainer>
    );
};

export default CodeblockNode;
