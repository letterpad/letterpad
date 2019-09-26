import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ContentEditable extends Component {
  static propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.object,
  };

  titleNode = React.createRef();

  componentDidMount() {
    this.titleNode.current.innerText = this.props.text;
  }

  shouldComponentUpdate() {
    return false;
  }

  emitChange = evt => {
    const text = evt.target.innerText;

    if (this.props.onChange) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      let enhancedEvt = Object.assign({}, evt, {
        target: {
          value: text,
        },
      });
      this.props.onChange(enhancedEvt);
    }
  };

  onPaste = evt => {
    this.titleNode.current.innerText = evt.currentTarget.innerText;
  };

  render() {
    return (
      <h1
        {...this.props}
        ref={this.titleNode}
        onInput={this.emitChange}
        onBlur={this.props.onBlur || this.emitChange}
        contentEditable={!this.props.disabled}
        onPaste={this.onPaste}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault();
          }
        }}
      />
    );
  }
}
