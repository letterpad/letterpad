/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AutoSizer,
  WindowScroller,
  List as VirtualizedList,
} from "react-virtualized";
import styled from "styled-components";

const DEFAULT_ROW_HEIGHT = 50;

const ListWrapper = styled.div<any>`
  height: ${p => p.windowScroller || "100%"};
  width: 100%;
  flex: 1;
`;

const NoDataCell = styled.div`
  height: ${DEFAULT_ROW_HEIGHT}px;
  line-height: ${DEFAULT_ROW_HEIGHT}px;
  margin: 0 0.5em;
`;

class ScrollbarsList extends Component<any, any> {
  state = {
    scrollTop: 0,
  };

  handleScroll = ({ target: { scrollTop } }) => {
    this.setState({ scrollTop });
  };

  render() {
    const { scrollTop } = this.state;
    const { width, height, listRef, noRowsMessage, ...props } = this.props;

    return (
      <VirtualizedList
        height={height}
        width={width}
        ref={listRef}
        scrollTop={scrollTop}
        noRowsRenderer={() => <div>No rows</div>}
        {...props}
      />
    );
  }
}

const List = ({
  noRowsMessage,
  windowScroller,
  listRef,
  onResize,
  scrollElement,
  ...props
}) =>
  windowScroller ? (
    <ListWrapper windowScroller>
      <WindowScroller scrollElement={scrollElement}>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight onResize={onResize}>
            {({ width }) => (
              <VirtualizedList
                autoHeight
                height={height}
                width={width}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                rowHeight={DEFAULT_ROW_HEIGHT}
                ref={listRef}
                noRowsRenderer={() => <NoDataCell>-</NoDataCell>}
                {...props}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </ListWrapper>
  ) : (
    <ListWrapper>
      <AutoSizer onResize={onResize}>
        {({ height, width }) => (
          <ScrollbarsList
            height={height}
            width={width}
            rowHeight={DEFAULT_ROW_HEIGHT}
            listRef={listRef}
            noRowsMessage={noRowsMessage}
            {...props}
          />
        )}
      </AutoSizer>
    </ListWrapper>
  );

List.propTypes = {
  noRowsMessage: PropTypes.string,
  windowScroller: PropTypes.bool,
  listRef: PropTypes.func,
};

List.defaultProps = {
  noRowsMessage: "No items.",
  windowScroller: false,
};

export default List;
