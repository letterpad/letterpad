import {
  EmbedContentCallBack,
  IEmbedParent,
  IEmbedProvider,
} from "../../../types/types";

import React from "react";
import embeds from "./embeds";
import styled from "styled-components";

export default class Embed extends React.Component<IEmbedParent> {
  get url(): string {
    return this.props.node.data.get("href");
  }

  getMatchResults(): { component: any; matches: string[] } {
    const keys = Object.keys(embeds);

    for (const key of keys) {
      const component = embeds[key];

      for (const host of component.ENABLED) {
        const matches = this.url.match(host);
        if (matches) return { component, matches };
      }
    }
  }

  getContent: EmbedContentCallBack = (instance, attrs, content = "") => {
    if (this.props.getContent) {
      this.props.getContent(instance, attrs, content);
    }
  };

  render() {
    const result = this.getMatchResults();
    if (!result) return null;

    const { attributes, isSelected, children } = this.props;
    const { component, matches } = result;
    const EmbedComponent: React.FC<IEmbedProvider> = component;
    if (!children)
      return (
        <EmbedComponent
          matches={matches}
          url={this.url}
          getContent={this.getContent}
        />
      );
    return (
      <Container
        contentEditable={false}
        isSelected={isSelected}
        {...attributes}
      >
        <EmbedComponent
          matches={matches}
          url={this.url}
          getContent={this.getContent}
        />
        {children}
      </Container>
    );
  }
}

const Container = styled.div<any>`
  text-align: center;
  line-height: 0;
  border-radius: 3px;
  box-shadow: ${props =>
    props.isSelected ? `0 0 0 2px var(--bg-success)` : "none"};
`;
