import React from "react";
import styled from "styled-components";

export enum SectionSizes {
  sm,
  xs,
  md,
}

interface ISectionProps {
  size: SectionSizes;
}
export const StyledSection = styled.section<ISectionProps>`
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
    h2 {
      margin: 20px 0px 10px;
      color: var(--color-text-1);
    }
  }
`;

const Section: React.FC<any> = ({ size, children, title, subtitle }) => {
  return (
    <StyledSection size={size}>
      {title && (
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </StyledSection>
  );
};

// Section.propTypes = {
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]),
//   title: PropTypes.any,
//   subtitle: PropTypes.string,
// };

export default Section;
