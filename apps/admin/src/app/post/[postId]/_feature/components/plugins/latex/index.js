const Katex = require("katex");

require("katex/dist/katex.min.css");

/**
 * Core
 */

function renderKatex(dom, code, el) {
  Katex.render(code, el, {
    output: "html",
    throwOnError: false,
  });
  dom.setAttrib(
    el,
    "class",
    dom.getAttrib(el, "class").trim() + " flex justify-center py-2"
  );
}

function isLatexNode(el) {
  return (
    el != null &&
    el.nodeName === "P" &&
    el.classList.contains("letterpad-katex") &&
    el.getAttribute("data-latex") !== null
  );
}

function getLatexNode(editor) {
  const node = editor.selection ? editor.selection.getNode() : null;
  return isLatexNode(node) ? node : undefined;
}

function insertLatexCode(editor, code) {
  const dom = editor.dom;
  editor.undoManager.transact(() => {
    const latexNode = getLatexNode(editor);
    code = tinymce.DOM.encode(code);

    if (latexNode) {
      dom.setAttrib(latexNode, "class", "letterpad-katex");
      dom.setAttrib(latexNode, "data-latex", code);
      latexNode.innerHTML = code;
      renderKatex(dom, code, latexNode);
    } else {
      editor.insertContent(
        `<p id="__new" class="letterpad-katex" data-latex="${code}"></p>`
      );
      const newEl = dom.select("#__new")[0];
      dom.setAttrib(newEl, "data-latex", code);
      dom.setAttrib(newEl, "id", null);
      editor.selection.select(newEl);
    }
  });
}

function getCurrentLatexCode(editor) {
  const node = getLatexNode(editor);
  return node ? editor.dom.getAttrib(node, "data-latex") : "";
}

function setupCore(editor) {
  editor.on("PreProcess", (e) => {
    const dom = editor.dom;
    const ps = dom.select("p.letterpad-katex[contenteditable=false]", e.node);
    tinymce.each(tinymce.grep(ps, isLatexNode), (elm) => {
      dom.setAttrib(elm, "class", dom.getAttrib(elm, "class").trim());
      dom.setAttrib(elm, "contentEditable", null);
      dom.setAttrib(elm, "data-mce-highlighted", null);

      // remove the P element
      let child;
      while ((child = elm.firstChild)) {
        elm.removeChild(child);
      }
    });
  });

  editor.on("SetContent", () => {
    const dom = editor.dom;
    const unprocessedCodeSamples = tinymce.grep(
      dom.select("p.letterpad-katex"),
      (elm) => {
        return (
          isLatexNode(elm) &&
          dom.getAttrib(elm, "data-mce-highlighted") !== "true"
        );
      }
    );

    if (unprocessedCodeSamples.length) {
      editor.undoManager.transact(() => {
        tinymce.each(unprocessedCodeSamples, (elm) => {
          renderKatex(dom, elm.getAttribute("data-latex"), elm);
          dom.setAttrib(elm, "data-mce-highlighted", true);
        });
      });
    }
  });

  editor.on("PreInit", () => {
    // here we cannot use p.letterpad-katex because
    // the parser does not support class selectors. It only supports
    // multiple tag names, for example p,h1.
    editor.parser.addNodeFilter("p", (nodes) => {
      for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        const isLatexNode =
          (node.attr("class") ?? "").indexOf("letterpad-katex") !== -1;
        if (isLatexNode) {
          node.attr("contenteditable", "false");
          node.attr("data-mce-highlighted", "false");
        }
      }
    });
  });
}

/**
 * Commands
 */

function registerCommands(editor) {
  editor.addCommand("latex", () => {
    const node = editor.selection.getNode();
    if (editor.selection.isCollapsed() || isLatexNode(node)) {
      openDialog(editor);
    } else {
      editor.formatter.toggle("code");
    }
  });
}

/**
 * Buttons
 */
function onSetupEditable(editor, onChanged) {
  return (api) => {
    const nodeChanged = () => {
      api.setEnabled(editor.selection.isEditable());
      onChanged(api);
    };
    editor.on("NodeChange", nodeChanged);
    nodeChanged();
    return () => editor.off("NodeChange", nodeChanged);
  };
}

function isLatexNodeSelection(editor) {
  const node = editor.selection.getStart();
  return editor.dom.is(node, 'p[class="letterpad-katex"]');
}

function registerButtons(editor) {
  const onAction = () => editor.execCommand("latex");

  editor.ui.registry.addToggleButton("latex", {
    icon: "latex",
    tooltip: "Insert/Edit Latex",
    onAction,
    onSetup: onSetupEditable(editor, (api) => {
      api.setActive(isLatexNodeSelection(editor));
    }),
  });

  editor.ui.registry.addMenuItem("latex", {
    text: "Insert/Edit Latex",
    icon: "latex",
    onAction,
    onSetup: onSetupEditable(editor),
  });
}

/**
 * Dialog
 */
function openDialog(editor) {
  const currentLatexCode = getCurrentLatexCode(editor);

  editor.windowManager.open({
    title: "Insert/Edit Latex",
    size: "normal",
    body: {
      type: "panel",
      items: [
        {
          type: "textarea",
          name: "code",
          label: "Latex Code",
        },
      ],
    },
    buttons: [
      {
        type: "cancel",
        name: "cancel",
        text: "Cancel",
      },
      {
        type: "submit",
        name: "save",
        text: "Save",
        primary: true,
      },
    ],
    initialData: {
      code: currentLatexCode,
    },
    onSubmit: (api) => {
      const data = api.getData();
      insertLatexCode(editor, data.code);
      api.close();
    },
  });
}

tinymce.PluginManager.add("latex", function (editor) {
  editor.ui.registry.addIcon("latex", "<span>TEX</span>");

  setupCore(editor);
  registerCommands(editor);
  registerButtons(editor);

  editor.on("dblclick", (e) => {
    if (isLatexNode(e.target)) {
      openDialog(editor);
    }
  });
});
