import * as React from "react";

import Frame, { iframeAttrs } from "../../../components/iframe";

import { IEmbedProvider } from "../../../../types/types";

const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i;

export default class YouTube extends React.Component<IEmbedProvider> {
  static ENABLED = [URL_REGEX];

  ref = React.createRef<HTMLIFrameElement>();

  componentDidMount() {
    if (this.props.getContent && this.ref.current) {
      this.props.getContent(this.ref.current, iframeAttrs);
    }
  }

  render() {
    const { matches } = this.props;
    const videoId = matches[1];

    return (
      <Frame
        forwardedRef={this.ref}
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
        // title={`YouTube (${videoId})`}
      />
    );
  }
}
