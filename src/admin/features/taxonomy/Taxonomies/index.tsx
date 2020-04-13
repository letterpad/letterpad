import React, { Component } from "react";

import List from "./List";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 300px;
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ListItem = styled.div<any>`
  display: flex;
  align-items: center;
  padding-left: 1.15rem;
  /* background-color: ${({ selected }) =>
    selected && "var(--color-accent)"}; */
  color: ${({ selected }) => selected && "var(--color-accent)"};
  &:hover {
    color: var(--color-accent);
  }
  cursor: pointer;
`;

class Taxonomies extends Component<any, any> {
  static defaultProps = {
    numRows: 4,
    rowHeight: 40,
  };

  state = {
    selectedIndex: this.props.selectedIndex,
  };

  handleClick = (index, item) => {
    const { handleSelect } = this.props;
    this.setState({ selectedIndex: index });
    handleSelect(index, item);
  };

  render() {
    let { items, rowHeight, numRows, selectedIndex } = this.props;
    numRows = numRows < 5 ? 8 : numRows;
    return (
      <Wrapper>
        <List
          width={767}
          height={numRows * rowHeight}
          rowCount={items.length}
          rowHeight={rowHeight}
          rowRenderer={({ key, index, style }) => {
            return (
              <ListItem
                key={key}
                style={style}
                index={index}
                selected={selectedIndex == index}
                onClick={() => this.handleClick(index, items[index])}
              >
                {items[index].name}
              </ListItem>
            );
          }}
        />
      </Wrapper>
    );
  }
}

export default Taxonomies;
