import * as React from "react";

import styled from "styled-components";

export const iframeAttrs = {
  sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
  width: "100%",
  height: "400px",
  type: "text/html",
  frameBorder: "0",
  title: "embed",
  loading: "lazy",
  allowFullScreen: true,
};

type Props = {
  src?: string;
  border?: boolean;
  forwardedRef?: any;
  width?: string;
  height?: string;
};

export default class Frame extends React.Component<Props, any> {
  state = {
    isLoaded: true,
  };
  mounted: boolean;

  componentDidMount() {
    this.mounted = true;
    setImmediate(this.loadIframe);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadIframe = () => {
    if (!this.mounted) return;
    this.setState({ isLoaded: true });
  };

  render() {
    const {
      border,
      width = "100%",
      height = "400",
      forwardedRef,
      ...rest
    } = this.props;
    const Component = border ? StyledIframe : "iframe";

    return (
      <Rounded width={width} height={height}>
        {this.state.isLoaded && (
          <Component ref={forwardedRef} {...iframeAttrs} {...rest} />
        )}
      </Rounded>
    );
  }
}

const Rounded = styled.div<any>`
  border-radius: 3px;
  overflow: hidden;
  width: ${props => props.width};
  height: ${props => props.height};
`;

// This wrapper allows us to pass non-standard HTML attributes through to the DOM element
// https://www.styled-components.com/docs/basics#passed-props
const Iframe = props => <iframe {...props} />;

const StyledIframe = styled(Iframe)`
  border: 1px solid;
  border-color: ${props => props.theme.embedBorder};
  border-radius: 3px;
`;
