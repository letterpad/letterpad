import * as React from "react";

import { IEmbedProvider, IFrameAttributes } from "../../../../types/types";

const URL_REGEX = new RegExp(
  "^https://gist.github.com/([a-zd](?:[a-zd]|-(?=[a-zd])){0,38})/(.*)$",
);

const iframeAttrs: IFrameAttributes = {
  width: "100%",
  height: "200px",
  frameBorder: "0",
};

class Gist extends React.Component<IEmbedProvider> {
  iframeNode: HTMLIFrameElement;

  static ENABLED = [URL_REGEX];

  componentDidMount() {
    this.updateIframeContent();
  }

  get id() {
    const gistUrl = new URL(this.props.url);
    return gistUrl.pathname.split("/")[2];
  }

  updateIframeContent() {
    const id = this.id;
    const iframe = this.iframeNode;
    if (!iframe) return;

    //@ts-ignore
    let doc = iframe.document;
    if (iframe.contentDocument) doc = iframe.contentDocument;
    else if (iframe.contentWindow) doc = iframe.contentWindow.document;

    const gistLink = `https://gist.github.com/${id}.js`;
    const gistScript = `<script type="text/javascript" src="${gistLink}"></script>`;
    const styles =
      "<style>*{ font-size:12px; } body { margin: 0; } .gist .blob-wrapper.data { max-height:150px; overflow:auto; }</style>";
    const iframeHtml = `<html><head><base target="_parent">${styles}</head><body>${gistScript}</body></html>`;

    if (this.props.getContent) {
      this.props.getContent(this.iframeNode, iframeAttrs, iframeHtml);
    }
    doc.open();
    doc.writeln(iframeHtml);
    doc.close();
  }

  render() {
    const id = this.id;

    return (
      <iframe
        ref={ref => {
          this.iframeNode = ref;
        }}
        {...iframeAttrs}
        id={`gist-${id}`}
        title={`Github Gist (${id})`}
      />
    );
  }
}

export default Gist;
