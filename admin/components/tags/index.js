import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import Wrapper from "./Tags.css";

export class StyledTags extends Component {
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
    const {
      labelKey,
      multi,
      onChange,
      options,
      value,
      valueKey,
      name,
    } = this.props;
    return (
      <Wrapper>
        <div className="meta-label">{name}</div>
        <div className="x_content">
          <div className="control-group">
            <Select.Creatable
              labelKey={labelKey}
              valueKey={valueKey}
              value={value}
              onChange={onChange}
              options={options}
              multi={multi}
            />
          </div>
        </div>
        <hr />
      </Wrapper>
    );
  }
}
export default StyledTags;
