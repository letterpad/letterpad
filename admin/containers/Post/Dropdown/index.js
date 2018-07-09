import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import sizeMe from "react-sizeme";

import List from "./List";

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    border: 1px solid #d3d3d3;
    height: ${({ rowHeight, isOpen, numRows }) =>
        `${isOpen ? numRows * rowHeight : 40}px`};
    flex-direction: column;
    user-select: none;
    overflow-x: hidden;
`;

const Header = styled.div`
    display: flex;
    width: 100%;
    height: 44px;
    align-items: center;
    padding: 0.5em;
    justify-content: space-between;
    cursor: pointer;
`;

const Icon = styled.i`
    margin-right: 0.5rem;
    font-size: 20px;
    cursor: pointer;
`;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    padding-left: 1.15rem;
    background-color: ${({ selected, index }) =>
        selected === index && "#3f3f40"};
    color: ${({ selected, index }) => selected === index && "white"};
    &:hover {
        background-color: ${({ index, selected }) =>
            selected === index ? "#3f3f40" : "#eee"};
    }
    cursor: pointer;
`;

class Accordion extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        rowHeight: PropTypes.number.isRequired,
        numRows: PropTypes.number,
        handleSelect: PropTypes.func.isRequired,
        handleDropdownClick: PropTypes.func.isRequired,
        size: PropTypes.object,
        selectedIndex: PropTypes.number,
        isMobile: PropTypes.bool,
        dropdownClicked: PropTypes.bool
    };

    static defaultProps = {
        numRows: 4,
        rowHeight: 40
    };

    state = {
        isOpen: false,
        selected: 0
    };

    componentDidUpdate(prevProps, prevState) {
        if (
            !this.props.isMobile &&
            this.props.isMobile !== prevProps.isMobile
        ) {
            this.setState({ isOpen: true });
        } else {
            if (
                this.props.dropdownClicked &&
                this.state.isOpen !== prevState.isOpen
            ) {
                this.setState({ isOpen: true });
            }
        }
    }

    handleOpen = () => {
        this.setState(s => ({ isOpen: !s.isOpen }));

        this.props.handleDropdownClick();
    };

    handleClick = (index, item) => {
        const { handleSelect } = this.props;

        this.setState({ selected: index });

        handleSelect(index, item);
    };

    render() {
        const { isOpen, isMobile, selected } = this.state;
        const { items, rowHeight, numRows, size } = this.props;

        return (
            <Wrapper isOpen={isOpen} rowHeight={rowHeight} numRows={numRows}>
                {isOpen ? (
                    <List
                        width={size.width - 2}
                        height={numRows * rowHeight}
                        rowCount={items.length}
                        rowHeight={rowHeight}
                        rowRenderer={({ key, index, style }) => (
                            <ListItem
                                key={key}
                                style={style}
                                index={index}
                                selected={selected}
                                onClick={() =>
                                    this.handleClick(index, items[index])
                                }
                            >
                                {items[index].name}
                            </ListItem>
                        )}
                    />
                ) : (
                    <Header onClick={this.handleOpen}>
                        {items[0].slug}
                        {!isMobile && <Icon className="fa caret-down" />}
                    </Header>
                )}
            </Wrapper>
        );
    }
}

export default sizeMe()(Accordion);
