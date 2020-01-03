import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select/creatable";

import Wrapper from "./Tags.css";
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#333" : "#000",
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
      <Wrapper>
        <div className="meta-label">{this.props.name}</div>
        <div className="x_content">
          <div className="control-group">
            <Select {...this.props} styles={customStyles} />
          </div>
        </div>
        <hr />
      </Wrapper>
    );
  }
}
export default StyledTags;
