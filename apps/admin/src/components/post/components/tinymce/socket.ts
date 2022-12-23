import { Editor } from "@tinymce/tinymce-react";
import io from "socket.io-client";

import { wsUrl } from "@/constants";

import Grammar, { GrammarBase } from "../language-tool/grammar";

class Socket {
  editor: Editor["editor"] = undefined;
  socket: ReturnType<typeof io> | null = null;
  grammar: GrammarBase;
  onContentChange = () => null;
  nodes: Array<Element> = [];
  listenersActivated = false;
  isAvailable = true;

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
    if (this.editor && !this.listenersActivated) {
      this.grammar.activateListeners(this.editor.getElement(), this.onChange);
    }
    this.socket = await this._initSocket();

    this.socket.on("REVIEW", this.onReviewRecieve);
  }

  onReviewRecieve({ correction, index }) {
    if (!this.editor) {
      return false;
    }

    if (this.nodes.length > 0) {
      const html = this.nodes[index].innerHTML;
      const suggested = this.grammar.getSuggestedHtml(html, correction);
      this.nodes[index].innerHTML = suggested;
      this.applyTooltip();
    }
  }

  async checkGrammar() {
    this.isAvailable = false;
    this.removeGrammar();
    this.nodes = this._getDomNodesForCorrection();

    const promises = this.nodes.map((node, index) => {
      return this.sendMessage({
        //@ts-ignore
        m: node.innerText,
        index,
      });
    });
    await Promise.all(promises);
    this._checkComplete();
  }

  sendMessage(data) {
    const socket = this.socket;
    return new Promise((resolve) => {
      socket?.emit("REVIEW", data, function (response) {
        resolve(response);
      });
    });
  }

  removeGrammar() {
    const domBody = this.editor?.getElement();
    if (!domBody) return false;
    domBody.querySelectorAll("span.mark").forEach((spanElmt) => {
      spanElmt.outerHTML = spanElmt.innerHTML;
    });
    this.editor?.setContent(domBody.innerHTML);
  }

  private _checkComplete() {
    alert("Check complete!");
    this.isAvailable = true;
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
      placement: "bottom",
    });
  }

  private _getDomNodesForCorrection() {
    const body = this.editor?.getElement();
    const nodelist = body?.querySelectorAll("p, li, blockquote, h1, h2");

    const elementsArr = nodelist ? Array.from(nodelist) : [];
    return elementsArr.map((ele) => {
      ele.innerHTML = ele.innerHTML.replace(/&nbsp;/g, " ");
      return ele;
    });
  }

  private async _initSocket(): Promise<ReturnType<typeof io>> {
    if (this.socket?.connected) {
      return this.socket;
    }
    const p = async (resolve, reject) => {
      try {
        await fetch(wsUrl);
      } catch (err) {
        reject();
      } finally {
        const socket = io(window.location.origin, { path: wsUrl });
        socket.on("connect", () => {
          resolve(socket);
        });

        socket.on("disconnect", () => {});
      }
      return socket;
    };
    return new Promise(p);
  }
}

export const socket = new Socket(Grammar);
