import { Container, TitleContainer } from "./Section.css";
import React, { SyntheticEvent } from "react";

import { Button } from "../../components/button";
import { Link } from "react-router-dom";

export enum SectionSizes {
  sm,
  xs,
  md,
}

const Section: React.FC<any> = ({ size, children, title, subtitle }) => {
  return (
    <Container size={size}>
      {title && (
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </Container>
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

interface ITitle {
  title: string;
  btnLink?: string;
  onClick?: (e: SyntheticEvent) => void;
}
export const Title: React.FC<ITitle> = ({ title, btnLink, onClick }) => {
  return (
    <TitleContainer>
      <span>{title}</span>
      {btnLink && (
        <Link to={btnLink}>
          <Button btnSize="md" btnStyle="primary">
            <i className="fa fa-plus" />
            New
          </Button>
        </Link>
      )}

      {onClick && (
        <Button btnSize="md" btnStyle="primary" onClick={onClick}>
          <i className="fa fa-plus" />
          New
        </Button>
      )}
    </TitleContainer>
  );
};
