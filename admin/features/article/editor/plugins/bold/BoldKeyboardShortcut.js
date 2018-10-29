/* eslint-disable react/prop-types */
import { boldMarkStrategy } from "./BoldUtils";
import { isMod } from "../../helper/keyboard-event";

const BoldKeyboardShortcut = (event, change) => {
  if (isMod(event) && event.key === "b") return boldMarkStrategy(change);
  return;
};

export default BoldKeyboardShortcut;
