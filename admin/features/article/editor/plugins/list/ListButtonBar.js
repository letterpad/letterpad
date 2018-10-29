import React from "react";

import { UnorderedListButton, OrderedListButton } from "./";
// FIXME: Needs to handle assets files to work with SSR
if (require("exenv").canUseDOM) require("./ListButtonBar.css");

const ListButtonBar = props => (
  <React.Fragment>
    <UnorderedListButton {...props} />
    <OrderedListButton {...props} />
  </React.Fragment>
);

export default ListButtonBar;
