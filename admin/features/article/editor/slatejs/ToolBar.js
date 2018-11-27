import React from "react";
import classnames from "classnames";
import { cloneElement } from "../helper/clone";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0px;
  z-index: 9;

  display: flex;
  flex-flow: column-reverse;
  .toolbar-menu {
    padding: 8px;
    box-shadow: 0px -6px 20px rgba(0, 0, 0, 0.42);
    background: var(--bg-base);
    text-align: center;
    user-select: none;

    .material-icons {
      font-size: 18px;
      vertical-align: text-bottom;
    }
  }
`;

/* eslint-disable react/prop-types */
export default ({ children, style, className, ...rest }) => (
  <Wrapper className="toolbar-container">
    <div className={classnames("menu toolbar-menu", className)} style={style}>
      {cloneElement(children, rest)}
    </div>
  </Wrapper>
);
