import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// import StyledGrid from "../../components/grid";
import FileItem from "./FileItem";
import InfiniteScrollList from "./InfiniteScrollList";
import GetMedia from "../../data-connectors/GetMedia";
import config from "../../../config";

const StyledGrid = styled.div`
  > div {
    display: grid;
    height: auto;
    grid-auto-flow: row;
    grid-auto-rows: minmax(20px, auto);
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 15px;
  }
  article {
    opacity: 0.5;
    &.selected {
      opacity: 1;
    }
  }
`;
class FileExplorer extends Component {
  static propTypes = {
    media: PropTypes.object,
    author: PropTypes.object,
    loading: PropTypes.bool,
    onPageClick: PropTypes.func,
    onSelect: PropTypes.func,
    fetchMore: PropTypes.func,
    count: PropTypes.number,
    multi: PropTypes.bool,
  };

  static defaultProps = {
    media: {
      rows: [],
    },
    multi: false,
    onPageClick: () => {},
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  page = 1;

  state = {
    selected_ids: [],
  };

  onMediaSelected = media => {
    const selected_ids = [...this.state.selected_ids];
    const index = selected_ids.indexOf(media.id);
    if (index >= 0) {
      selected_ids.splice(index, 1);
    } else if (selected_ids.length >= 0 && this.props.multi) {
      selected_ids.push(media.id);
      const selectedMediaUrls = this.props.media.rows
        .filter(item => selected_ids.indexOf(item.id) >= 0)
        .map(media => media.url);
      this.props.onSelect(selectedMediaUrls);
    }
    this.setState({ selected_ids });
  };

  loadMore = async num => {
    await this.props.fetchMore({
      authorId: this.props.author.id,
      offset: (num - 1) * config.mediaPerPage,
      limit: config.mediaPerPage,
      merge: true,
    });
    this.page = num;
    this.forceUpdate();
  };

  render() {
    const rows = this.props.media.rows.map(media => (
      <FileItem
        key={media.id}
        media={media}
        isSelected={this.state.selected_ids.indexOf(media.id) >= 0}
        onMediaSelected={this.onMediaSelected}
      />
    ));
    return (
      <StyledGrid
        className="grid"
        columns="repeat(auto-fit, minmax(200px, 1fr))"
      >
        <InfiniteScrollList
          data={rows}
          count={this.props.count}
          page={this.page}
          loadMore={this.loadMore}
        />
      </StyledGrid>
    );
  }
}

export default GetMedia(FileExplorer);
