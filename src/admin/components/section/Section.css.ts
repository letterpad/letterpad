import { SectionSizes } from "./index";
import { device } from "./../../features/devices";
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
  padding: 60px;

  @media ${device.laptop} {
    padding: 40px;
  }
  @media ${device.tablet} {
    padding: 30px;
  }
  @media ${device.mobile} {
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
      @media ${device.mobile} {
        font-size: 1.8rem;
      }
    }
    .section-description {
      margin-top: 24px;
      max-width: 767px;
    }
  }

  .material-icons {
    font-size: 1rem;
  }

  label {
    opacity: 0.6;
    font-weight: 400;
    font-size: 0.7rem;
    text-transform: uppercase;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    letter-spacing: 1px;
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

    @media ${device.mobile} {
      padding: 4px 10px;
    }
  }
`;
