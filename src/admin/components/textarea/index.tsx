import React from "react";
import styled from "styled-components";

type TextAreaProps = {
  autoAdjustHeight?: boolean;
};

export class TextArea extends React.Component<
  TextAreaProps & React.HTMLProps<HTMLTextAreaElement>
> {
  private textAreaRef = React.createRef<HTMLTextAreaElement>();

  componentDidMount() {
    const element = this.textAreaRef.current;
    if (!this.props.autoAdjustHeight || !element) {
      return;
    }

    if (element.scrollHeight) {
      this.resize();
    } else {
      element.style.height = "auto";
    }
  }

  resize = (event?: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = this.textAreaRef.current;
    if (element) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    }

    if (event && typeof this.props.onChange === "function") {
      this.props.onChange(event);
    }
  };

  render() {
    const { autoAdjustHeight, ...textAreaProps } = this.props;
    return (
      <textarea
        {...textAreaProps}
        ref={this.textAreaRef}
        onChange={this.resize}
      />
    );
  }
}
