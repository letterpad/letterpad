import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import List from "./List";

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    border: 1px solid #d3d3d3;
    min-height: 300px;
    flex-direction: column;
    user-select: none;
    overflow-y: auto;
    overflow-x: hidden;
`;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    padding-left: 1.15rem;
    background-color: ${({ selected }) => selected && "#3f3f40"};
    color: ${({ selected }) => selected && "white"};
    &:hover {
        background-color: ${({ selected }) => (selected ? "#3f3f40" : "#eee")};
    }
    cursor: pointer;
`;

class Taxonomies extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        rowHeight: PropTypes.number.isRequired,
        numRows: PropTypes.number,
        handleSelect: PropTypes.func.isRequired,
        size: PropTypes.object,
        selectedIndex: PropTypes.number
    };

    static defaultProps = {
        numRows: 4,
        rowHeight: 40
    };

    state = {
        selectedIndex: this.props.selectedIndex
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
            <Wrapper rowHeight={rowHeight} numRows={numRows}>
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
                                onClick={() =>
                                    this.handleClick(index, items[index])
                                }
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
