import { Editor } from "@tinymce/tinymce-react";
import io from "socket.io-client";
import Grammar from "../language-tool/grammar";

class Socket {
  editor: Editor["editor"] = undefined;
  socket: ReturnType<typeof io> | null = null;
  grammar: any;
  onContentChange = () => {};
  nodes: Array<Element> = [];

  constructor(grammar) {
    this.grammar = new grammar();
    this.onChange = this.onChange.bind(this);
    this.onReviewRecieve = this.onReviewRecieve.bind(this);
  }

  setEditor(editor: Editor["editor"]) {
    this.editor = editor;
  }

  onChange() {
    this.onContentChange();
  }

  setChangeHandler(fn) {
    this.onContentChange = fn;
  }

  async connectSocketAndAddListeners() {
    if (this.editor) {
      this.grammar.activateListeners(this.editor.getDoc(), this.onChange);
    }
    this.socket = await this._initSocket();

    this.socket.on("REVIEW", this.onReviewRecieve);
  }

  onReviewRecieve({ correction, index }) {
    console.log(correction, index);
    if (!this.editor) {
      return false;
    }

    if (this.nodes.length > 0) {
      const html = this.nodes[index].innerHTML;
      const suggested = this.grammar.getSuggestedHtml(html, correction);
      this.nodes[index].innerHTML = suggested;
      this.applyTooltip();
    }

    if (index === this.nodes.length - 1) {
      this._checkComplete();
    }
  }

  checkGrammar() {
    this.removeGrammar();
    this.nodes = this._getDomNodesForCorrection();
    this.nodes.forEach((node, index) => {
      //@ts-ignore
      this.socket?.emit("REVIEW", { m: node.innerText, index });
    });
  }

  removeGrammar() {
    const domBody = this.editor?.getDoc().body;
    if (!domBody) return false;
    domBody.querySelectorAll("mark").forEach((spanElmt) => {
      spanElmt.outerHTML = spanElmt.innerHTML;
    });
    this.editor?.setContent(domBody.innerHTML);
  }

  private _checkComplete() {
    const hasErrors = this.editor
      ?.getDoc()
      .body.querySelectorAll("[data-offset-start]");
    if (hasErrors?.length === 0) {
      alert("No Errors found");
    }
  }

  disconnect() {
    this.socket?.disconnect();
  }

  applyTooltip() {
    const win = this.editor?.getWin();
    if (!win || !win["tippy"]) {
      return false;
    }

    win["tippy"]("[data-tippy-content]", {
      allowHTML: true,
      interactive: true,
      appendTo: win.document.body,
      zIndex: 99999999,
      popperOptions: {
        positionFixed: true,
        allowHTML: true,
        zIndex: 99999999,
        interactive: true,
      },
    });
  }

  private _getDomNodesForCorrection() {
    const body = this.editor?.getBody();
    const nodelist = body?.querySelectorAll("p, li, blockquote, h1, h2");

    const elementsArr = nodelist ? Array.from(nodelist) : [];
    return elementsArr.map((ele) => {
      ele.innerHTML = ele.innerHTML.replace(/&nbsp;/g, " ");
      return ele;
    });
  }

  private async _initSocket(): Promise<ReturnType<typeof io>> {
    return new Promise(async (resolve, reject) => {
      try {
        await fetch("/admin/api/socket.io");
      } catch (err) {
        reject();
      } finally {
        const socket = io();
        socket.on("connect", () => {
          console.log("Socket connected");
          resolve(socket);
          socket.emit("hello");
        });

        socket.on("disconnect", () => {
          console.log("disconnect");
        });
      }
    });
  }
}

export const socket = new Socket(Grammar);
