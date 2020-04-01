import React, { Component } from "react";

import PropTypes from "prop-types";
import Select from "react-select/creatable";

// import Wrapper from "./Tags.css";
const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isFocused ? "var(--bg-base)" : "var(--color-base)",
      background: state.isFocused ? "var(--color-accent)" : "transparent",
      cursor: "pointer",
    };
  },
  menu: (provided, state) => ({
    ...provided,
    color: "var(--color-base)",
    background: "var(--bg-sections)",
    fontSize: "14px",
    marginTop: "0px",
    borderRadius: "0px 0px 3px 2px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: "0px",
  }),
  indicatorContainer: (provided, state) => ({
    ...provided,
    color: "var(--color-base)",
  }),
  control: (provided, state) => ({
    ...provided,
    background: "var(--bg-base)",
    color: "var(--color-base)",
    border: "1px solid var(--color-border)",
    borderRadius: "2px",
    "&:hover": {
      border: "1px solid var(--color-border)",
    },
  }),
  multiValue: (provided, state) => ({
    ...provided,
    background: "var(--color-accent)",
    border: "1px solid var(--color-accent)",
    color: "#FFF",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "#FFF",
  }),
  input: (provided, state) => ({
    ...provided,
    color: "var(--color-base)",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "var(--color-muted)",
    fontSize: "14px",
  }),
};

export class StyledTags extends Component<any, any> {
  static propTypes = {
    labelKey: PropTypes.string,
    multi: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.array,
    valueKey: PropTypes.string,
    name: PropTypes.string,
  };

  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        <Select {...this.props} styles={customStyles} />
      </div>
    );
  }
}
export default StyledTags;
