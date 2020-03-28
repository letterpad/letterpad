import StyledSection, { SectionSizes } from "../../components/section";

import GettingStarted from "./GettingStarted";
import QuickDraft from "./QuickDraft";
import React from "react";
import Stats from "./Stats";
import StyledGrid from "../../components/grid";

const Home: React.FC = () => {
  return (
    <StyledSection size={SectionSizes.xs}>
      <StyledGrid columns="repeat(auto-fit,minmax(400px,1fr))">
        <GettingStarted />
        <QuickDraft />
        <Stats />
      </StyledGrid>
    </StyledSection>
  );
};

export default Home;
