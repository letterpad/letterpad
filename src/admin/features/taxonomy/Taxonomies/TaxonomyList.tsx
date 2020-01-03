import React from "react";
import styled from "styled-components";
import { Taxonomy } from "../../../../__generated__/gqlTypes";

const Container = styled.ul`
  list-style-type: none;
  height: calc(100% - 50px);
  overflow-y: auto;
  li {
    height: 40px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    cursor: pointer;

    &.selected {
      font-weight: bold;
      color: var(--color-accent);
    }
  }
`;

interface ITaxonomyListProps {
  taxonomies: Taxonomy[];
  selectedIndex: number;
  setTaxonomyIndex: (index: number) => void;
}

const TaxonomyList: React.FC<ITaxonomyListProps> = ({
  taxonomies,
  setTaxonomyIndex,
  selectedIndex,
}) => {
  return (
    <Container>
      {taxonomies.map((item, index) => {
        return (
          <li
            className={selectedIndex === index ? "selected" : ""}
            onClick={() => setTaxonomyIndex(index)}
          >
            {item.name}
          </li>
        );
      })}
    </Container>
  );
};

export default TaxonomyList;
