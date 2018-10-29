import scrollToCursor from "../../helper/scrollToCursor";

const AutoScrollPlugin = () => {
  return {
    onKeyDown(event) {
      if (event.key == "Enter" || event.key == "Backspace") {
        event.preventDefault();
        scrollToCursor();
      }
      return;
    },
  };
};

export { AutoScrollPlugin };
