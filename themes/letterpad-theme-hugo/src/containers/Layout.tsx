import React, { Component } from "react";

import Header from "../components/Header";
import { ILayoutProps } from "letterpad-src/client/types";
import StyledMain from "../styled/StyledMain";
import styled from "styled-components";

require("../public/pcss/client.pcss");

const darkTheme = `
    --color-base: #dfdfdf;
    --color-menu-link: #fff;
    --color-border: #3c3c3c;
    --color-accent: 70,183, 70;
    --color-headings: #fff;
    --bg-article-item: 30, 34, 50;
    --bg-content: 25, 28, 39;
    --bg-sidebar: 25, 28, 39;
`;

const lightTheme = `
    --color-menu-link: #fff;
    --color-accent: 20, 181, 239;
    --color-headings: #000;
    --bg-article-item: 240, 240, 240;
    --bg-content: 255, 255, 255;
    --bg-sidebar: 25, 28, 39;
`;
const CSSVariables = styled.div<any>`
  ${props => (props.dark ? darkTheme : lightTheme)};
`;

class Layout extends Component<ILayoutProps, {}> {
  state = {
    theme: "light".toLowerCase(),
  };

  switchTheme = theme => {
    this.setState({ theme });
  };

  render() {
    const { Content, ...props } = this.props;
    const { settings, router } = props;
    const theme = {
      [this.state.theme]: true,
    };
    return (
      <CSSVariables {...theme}>
        <Header
          settings={settings}
          router={router}
          switchTheme={this.switchTheme}
        />
        <StyledMain>
          <Content {...props} />
        </StyledMain>
        <footer
          className="site-footer"
          dangerouslySetInnerHTML={{
            __html: settings.site_footer.value,
          }}
        />
      </CSSVariables>
    );
  }
}

export default Layout;
