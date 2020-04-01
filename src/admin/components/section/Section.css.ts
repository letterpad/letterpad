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
        return "48px 72px";
      default:
        return "16px";
    }
  }};
  @media (max-width: 767px) {
    padding: 16px;
  }

  .section-header {
    margin-bottom: 36px;
    color: var(--color-text-2);
    font-size: 0.94rem;
    font-weight: 400;
    width: 100%;
    .section-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h2 {
      margin: 0px;
      color: var(--color-base);
      font-size: 2.2rem;
      font-weight: 300;
    }
    p {
      max-width: 767px;
    }
  }
  .material-icons {
    font-size: 1rem;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ActionsContainer = styled.div`
  button {
    padding: 8px 40px;
    text-transform: uppercase;
    border-radius: 2px;
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 0.8rem;
  }
`;
