import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  label {
    color: var(--base-shade-3);
    font-weight: 500;
    font-size: 13px;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
  }
  [type="checkbox"] {
    &:checked,
    &:not(:checked) {
      position: absolute;
      left: -9999px;
    }
    &:checked + label,
    &:not(:checked) + label {
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #666;
    }
    &:checked + label:before,
    &:not(:checked) + label:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      border: 1px solid #ddd;
      background: #fff;
    }
    &:checked + label:after {
      content: "";
      width: 8px;
      height: 8px;
      background: #00a69c;
      position: absolute;
      top: 6px;
      left: 6px;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
    }
    &:not(:checked) + label:after {
      content: "";
      width: 8px;
      height: 8px;
      background: #00a69c;
      position: absolute;
      top: 6px;
      left: 6px;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    &:checked + label:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;

const Checkbox: React.FC<ICheckboxProps> = ({ label, ...props }) => {
  handleCheckBoxChange = e => {
    const { cbRegistry } = this.state;
    const index = cbRegistry.indexOf(e.target.value);
    // if found then remove
    if (index >= 0) {
      cbRegistry.splice(index, 1);
    } else {
      cbRegistry.push(e.target.value);
    }
    this.setState({ cbRegistry });
    this.props.onChange(e.target.name, cbRegistry);
  };

  return (
    <Wrapper className="check-box">
      <label
        className="custom-label"
        dangerouslySetInnerHTML={{ __html: label }}
      />

      {data.map(option => {
        return (
          <div key={option.name}>
            <input
              type="checkbox"
              name={data.name}
              value={option}
              id={option}
              defaultChecked={data.defaultValue.indexOf(option) >= 0}
              onClick={handleCheckBoxChange}
            />
            <label htmlFor={option}>{data.label}</label>
          </div>
        );
      })}
    </Wrapper>
  );
};

class StyledCheckbox extends Component<any, any> {
  state = {
    cbRegistry: [],
  };

  handleCheckBoxChange = e => {
    const { cbRegistry } = this.state;
    const index = cbRegistry.indexOf(e.target.value);
    // if found then remove
    if (index >= 0) {
      cbRegistry.splice(index, 1);
    } else {
      cbRegistry.push(e.target.value);
    }
    this.setState({ cbRegistry });
    this.props.onChange(e.target.name, cbRegistry);
  };

  render() {
    const { label, data, innerRef, ...props } = this.props;
    if (innerRef) {
      props.ref = innerRef;
    }
  }
}

// StyledCheckbox.propTypes = {
//   label: PropTypes.string,
//   onChange: PropTypes.func,
//   data: PropTypes.array,
//   innerRef: PropTypes.object,
// };

export default StyledCheckbox;
