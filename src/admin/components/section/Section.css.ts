import { SectionSizes } from "./index";
import styled from "styled-components";
interface ISectionProps {
  size: SectionSizes;
}

export const Container = styled.section<ISectionProps>`
  background-attachment: fixed;
  position: relative;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  padding: ${props => {
    switch (props.size) {
      case SectionSizes.sm:
        return "8px";
      case SectionSizes.xs:
        return "16px";
      case SectionSizes.md:
        return "32px";
      default:
        return "16px";
    }
  }};
  .section-header {
    margin-bottom: 36px;
    color: var(--color-text-2);
    font-size: 13px;
    font-weight: 400;
    width: 100%;
    h2 {
      margin: 20px 0px 10px;
      color: var(--color-text-1);
    }
    p {
      max-width: 767px;
    }
  }
  .material-icons {
    font-size: 16px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
