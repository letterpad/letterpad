import { ActionsContainer, Container, TitleContainer } from "./Section.css";
import React, { SyntheticEvent } from "react";

export enum SectionSizes {
  sm,
  xs,
  md,
}

const Section: React.FC<any> = ({
  size,
  children,
  title,
  subtitle,
  rightToolbar,
}) => {
  return (
    <Container size={size}>
      {title && (
        <div className="section-header">
          <div className="section-row">
            <h2>{title}</h2>
            {rightToolbar && (
              <ActionsContainer>{rightToolbar}</ActionsContainer>
            )}
          </div>
          {subtitle && <p className="section-description">{subtitle}</p>}
        </div>
      )}
      {children}
    </Container>
  );
};

export default Section;
