import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";
import { StaticContext } from "../Context";

class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

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
      let src = config.baseName + "/uploads/loading.jpg";
      if (isStatic) {
        src = this.props.src;
      }
      return <img src={src} width={this.props.width} />;
    }
    return <img src={this.props.src} width={this.props.width} />;
  }
}
LazyImage.defaultProps = {
  width: "100%",
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
};
LazyImage.contextType = StaticContext;

export default LazyImage;
