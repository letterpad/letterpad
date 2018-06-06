import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";

class LazyImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        const img = new Image();
        img.src = this.props.src;
        img.onload = () => {
            this.setState({ loaded: true });
        };
    }

    render() {
        if (!this.state.loaded) {
            return (
                <img
                    src={config.baseName + "/uploads/loading.jpg"}
                    width={this.props.width}
                />
            );
        }
        return <img src={this.props.src} width={this.props.width} />;
    }
}
LazyImage.defaultProps = {
    width: "100%"
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.string
};

export default LazyImage;
