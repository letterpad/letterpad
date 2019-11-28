import React, { Component } from "react";
import PropTypes from "prop-types";
import StyledInput from "../../components/input";

class CustomCSS extends Component {
  static propTypes = {
    updateOption: PropTypes.func,
    options: PropTypes.object,
    settings: PropTypes.object,
  };

  state = {
    css: this.props.settings.css.value,
  };

  updatedOptions = {};

  componentDidMount() {
    this.setState({ loading: true }, this.getThemes);
    document.body.classList.add("settings-css-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("settings-css-page");
  }

  handleCssChange = e => {
    const newState = { css: e.target.value };
    this.setState(newState);
    this.props.updateOption("css", e.target.value);
  };

  render() {
    return (
      <div>
        <StyledInput
          textarea
          rows="7"
          value={this.state.css}
          placeholder="Additional CSS"
          onChange={this.handleCssChange}
        />
      </div>
    );
  }
}

export default CustomCSS;
