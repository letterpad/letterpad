import { Editor } from "@tinymce/tinymce-react/node_modules/tinymce/tinymce";

export const initImagePlugin = (editor: Editor, { onMediaBrowse }) => {
  editor.ui.registry.addButton("customImage", {
    icon: "image",
    onAction: function (_) {
      onMediaBrowse && onMediaBrowse();
    },
  });

  editor.ui.registry.addButton("img-left", {
    icon: "align-left",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentNode;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        style.float = "left";
        editor.dom.setAttrib(
          editor.selection.getNode().parentNode,
          "style",
          styleString(style),
        );
      }
    },
  });

  editor.ui.registry.addButton("img-right", {
    icon: "align-right",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentNode;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        style.float = "right";
        editor.dom.setAttrib(
          editor.selection.getNode().parentNode,
          "style",
          styleString(style),
        );
        // editor.dom.setAttrib(
        //   figure,
        //   "style",
        //   `${styleString(style)}`,
        // );
      }
    },
  });

  editor.ui.registry.addButton("img-center", {
    icon: "align-center",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentNode;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        delete style.float;
        style.margin = "auto";
        editor.dom.setAttrib(
          editor.selection.getNode().parentNode,
          "style",
          styleString(style),
        );
      }
    },
  });
  editor.ui.registry.addButton("width", {
    icon: "resize",
    onAction: function (_) {
      editor.windowManager.open({
        title: "Example plugin",
        body: {
          type: "panel",
          items: [
            {
              type: "input",
              name: "catdata",
              label: "enter the name of a cat",
            },
            {
              type: "checkbox",
              name: "isdog",
              label: "tick if cat is actually a dog",
            },
          ],
        },
        onSubmit: (params) => {
          const d = params.getData();

          editor.dom.setAttrib(
            editor.selection.getNode().parentNode,
            "style",
            `width:${d.catdata}`,
          );

          editor.dom.setHTML(
            editor.selection.getNode().parentNode?.querySelector("figcaption"),
            d.catdata,
          );

          params.close();
        },

        buttons: [
          {
            type: "cancel",
            name: "closeButton",
            text: "Cancel",
          },
          {
            type: "submit",
            name: "submitButton",
            text: "Do Cat Thing",
            primary: true,
          },
        ],
        //  body: [{ type: "textbox", name: "title", label: "Title" }],
        //  onsubmit: function (e) {
        //    // Insert content when the window form is submitted
        //    editor.insertContent("Title: " + e.data.title);
        //  },
      });
    },
  });

  const isImage = (node: Element): boolean => {
    return node.nodeName === "IMG" || node.nodeName === "FIGURE";
  };

  editor.ui.registry.addContextToolbar("hello", {
    predicate: isImage,
    items: "width img-left img-center img-right",
    position: "selection",
    scope: "node",
  });

  editor.on("keydown", function (e) {
    // move cursor to next element when hitting enter on figcaption
    if (e.key == "Enter") {
      const tag = editor.selection.getNode().tagName;
      if (tag === "FIGCAPTION") {
        const range = new Range();
        const nextEle =
          editor.selection.getNode().parentElement?.parentElement
            ?.nextElementSibling;
        if (nextEle) {
          range.setStart(nextEle, 0);
          range.setEnd(nextEle, 0);
          editor.selection.setRng(range, true);
        }
        e.preventDefault();
      }
    }
  });
};

function styleObject(css: null | string) {
  if (!css) return {};
  const styles = css.split(";");
  const result = {};
  styles.forEach((s) => {
    if (s.split(":").length == 2) {
      const [k, v] = s.split(":");
      result[k.trim()] = v.trim();
    }
  });
  return result;
}

const styleString = (style) =>
  Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
