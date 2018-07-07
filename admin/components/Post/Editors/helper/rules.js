import React from "react";
import styled from "styled-components";
import { BLOCK_TAGS, MARK_TAGS, INLINE_TAGS } from "./constants";
import { BoldMark } from "../plugins/bold";

const CodeblockContainer = styled.div`
    position: relative;
`;
export default [
    {
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                return {
                    object: "block",
                    type: type,
                    data: {
                        className: el.getAttribute("class"),
                        src: el.getAttribute("src") || null,
                        href: el.getAttribute("href") || null
                    },
                    nodes: next(el.childNodes)
                };
            }
        },
        serialize(obj, children) {
            if (obj.object == "block") {
                switch (obj.type) {
                    // case "code":
                    //     return <code>{children}</code>;
                    case "paragraph":
                        return (
                            <p className={obj.data.get("className")}>
                                {children}
                            </p>
                        );
                    case "image":
                        return (
                            <img
                                src={obj.data.get("src")}
                                className={obj.data.get("className")}
                            />
                        );
                    case "quote":
                        return <blockquote>{children}</blockquote>;
                    case "code_block":
                        return (
                            <CodeblockContainer>
                                <pre className="prism-dark">
                                    <code>{children}</code>
                                </pre>
                            </CodeblockContainer>
                        );

                    default:
                        return <p />;
                }
            }
        }
    },
    // Add a new rule that handles marks...
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                return {
                    object: "mark",
                    type: type,
                    nodes: next(el.childNodes)
                };
            }
        },
        serialize(obj, children) {
            if (obj.object == "mark") {
                const props = { children };
                switch (obj.type) {
                    case "bold":
                        return <BoldMark {...props} />;
                    case "italic":
                        return <em>{children}</em>;
                    case "underline":
                        return <u>{children}</u>;
                    case "highlight":
                        return <code>{children}</code>;
                }
            }
        }
    },
    {
        deserialize: function(el, next) {
            if (el.tagName != "a") {
                return;
            }
            const type = INLINE_TAGS[el.tagName];

            if (!type) {
                return;
            }
            return {
                object: "inline",
                type: type,
                nodes: next(el.childNodes),
                data: {
                    href: el.attrs.find(({ name }) => name == "href").value
                }
            };
        },
        serialize: function(obj, children) {
            if (obj.object != "inline") {
                return;
            }
            switch (obj.type) {
                case "link":
                    return <a href={obj.data.get("href")}>{children}</a>;
            }
        }
    }
];
