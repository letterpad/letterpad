import React, { Component } from "react";

import { CoverImage } from "../../__generated__/gqlTypes";
import { StaticContext } from "../Context";
import config from "../../config";

class LazyImage extends Component<CoverImage, { loaded: boolean }> {
  state = {
    loaded: false,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const img = new Image();
    img.src = this.props.src;
    img.onload = () => {
      if (this.mounted) {
        this.setState({ loaded: true });
      }
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const isStatic = this.context ? this.context.isStatic : false;

    if (!this.state.loaded) {
      let src = config.BASE_NAME + "/uploads/loading.jpg";
      if (isStatic) {
        src = this.props.src;
      }
      return <img src={src} width={this.props.width || "100%"} />;
    }
    return <img src={this.props.src} width={this.props.width} />;
  }
}

LazyImage.contextType = StaticContext;

export default LazyImage;
