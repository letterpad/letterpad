import React from "react";
import GettingStarted from "./GettingStarted";
import QuickDraft from "./QuickDraft";
import Stats from "./Stats";
import { StyledSection, SectionSizes } from "../../components/section";
import StyledGrid from "../../components/grid";

const Home: React.FC = () => {
  return (
    <StyledSection size={SectionSizes.sm}>
      <StyledGrid columns="repeat(auto-fit,minmax(400px,1fr))">
        <GettingStarted />
        <QuickDraft />
        <Stats />
      </StyledGrid>
    </StyledSection>
  );
};

export default Home;
