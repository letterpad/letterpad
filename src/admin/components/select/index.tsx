import React, { Component } from "react";

import StyledSelect from "./Select.css";

class Select extends Component<any, any> {
  rootRef = React.createRef<HTMLDivElement>();

  state = {
    open: false,
    options: this.props.options,
    selected: this.props.selected,
  };

  componentDidMount() {
    const { options, selected } = this.props;
    const option = options.filter(
      option => selected && selected.includes(option.value),
    );
    if (option.length > 0) {
      this.setState({ selected: option[0].name });
    }
    document.addEventListener("click", this.closeSelect);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.closeSelect);
  }

  closeSelect = e => {
    const rootNode = this.rootRef.current;
    if (rootNode && !rootNode.contains(e.target)) {
      this.setState({ open: false });
    }
  };

  toggleSelect = () => {
    this.setState({ open: !this.state.open });
  };

  onChange = (e, newOption) => {
    e.preventDefault();
    this.props.onChange(newOption.value);
    this.setState({ open: false, selected: newOption.name });
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { options, selected, onChange, label, ...props } = this.props;
    return (
      <StyledSelect {...props} ref={this.rootRef}>
        {label && (
          <label
            className="custom-label"
            dangerouslySetInnerHTML={{ __html: label }}
          />
        )}
        <div className="select-name" onClick={this.toggleSelect}>
          {this.state.selected}
          <i className="material-icons">arrow_drop_down</i>
        </div>

        {this.state.open && (
          <ul className="options">
            {options.map(option => {
              let className = this.state.selected.includes(option.name)
                ? " selected"
                : "";
              return (
                <li
                  onClick={e => this.onChange(e, option)}
                  key={option.name}
                  className={className}
                  value={option.value}
                >
                  {option.name}
                </li>
              );
            })}
          </ul>
        )}
      </StyledSelect>
    );
  }
}

export default Select;
