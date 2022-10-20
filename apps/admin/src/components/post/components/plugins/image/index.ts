import { Editor } from "tinymce";

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
      const figure = editor.selection.getNode().parentElement;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        style.float = "left";
        editor.dom.setStyles(figure, style);
        editor.save();
      }
    },
  });

  editor.ui.registry.addButton("img-right", {
    icon: "align-right",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentElement;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        style.float = "right";
        editor.dom.setStyles(figure, style);
        editor.save();
      }
    },
  });

  editor.ui.registry.addButton("img-center", {
    icon: "align-center",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentElement;
      if (figure) {
        const style = styleObject(figure.getAttribute("style"));
        style.float = "none";
        style.margin = "auto";
        editor.dom.setStyles(figure, style);
        editor.save();
      }
    },
  });

  editor.ui.registry.addButton("img-delete", {
    icon: "remove",
    onAction: function (_) {
      const figure = editor.selection.getNode().parentElement;
      if (figure) {
        editor.dom.remove(figure);
        editor.save();
        const toolbar = editor
          .getWin()
          .parent.document.querySelector(".tox-tinymce-aux");
        if (toolbar) toolbar.innerHTML = "";
      }
    },
  });

  editor.ui.registry.addButton("edit-image", {
    icon: "edit-image",
    onAction: function (_) {
      const image = editor.selection.getNode();
      let imgWidth = image.getBoundingClientRect().width + "px";
      const figStyles = image.parentElement?.getAttribute("style");
      if (figStyles) {
        const w = styleObject(figStyles).width;
        if (w) imgWidth = w;
      }
      const caption =
        image.parentElement?.querySelector("figcaption")?.innerHTML;

      editor.windowManager.open({
        title: "Image Properties",
        initialData: {
          width: imgWidth,
          caption,
        },
        body: {
          type: "panel",
          items: [
            {
              type: "input",
              name: "width",
              label: "Enter width of image in px or %",
              placeholder: "e.g. 100px, 70%",
            },
            {
              type: "input",
              name: "caption",
              label: "Enter caption of this image",
              placeholder: "Description of this image",
            },
          ],
        },
        onSubmit: (params) => {
          const d = params.getData() as Record<any, any>;
          const figure = editor.selection.getNode().parentElement;
          if (figure) {
            editor.dom.setStyle(figure, "width", d.width);
            const caption = figure.querySelector("figcaption");
            if (caption) {
              editor.dom.setHTML(caption, d.caption);
            }
          }
          params.close();
          editor.save();
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
            text: "Update",
            primary: true,
          },
        ],
      });
    },
  });

  const isImage = (node: Element): boolean => {
    return node.nodeName === "IMG" || node.nodeName === "FIGURE";
  };

  editor.ui.registry.addContextToolbar("hello", {
    predicate: isImage,
    items: "edit-image img-left img-center img-right img-delete",
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
          editor.selection.getNode().parentElement?.nextElementSibling;
        if (nextEle) {
          range.setStart(nextEle, 0);
          range.setEnd(nextEle, 0);
          editor.selection.setRng(range, true);
        }
        e.preventDefault();
      }
    }
    if (e.key == "Delete" || e.key == "Backspace") {
      const node = editor.selection.getNode();
      if (node.tagName === "FIGURE") {
        node.remove();
      }
      if (node.tagName === "IMG") {
        node.parentElement?.remove();
      }
    }
  });
};

function styleObject(css: null | string): Record<string, string> {
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
