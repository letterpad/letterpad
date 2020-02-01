import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// import StyledGrid from "../../components/grid";
import FileItem from "./FileItem";
import InfiniteScrollList from "./InfiniteScrollList";
import {
  Media,
  MediaNode,
  MediaQuery,
  MediaQueryVariables,
} from "../../../__generated__/gqlTypes";
import apolloClient from "../../../shared/apolloClient";
import { QUERY_MEDIA } from "../../../shared/queries/Queries";

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

interface IFileExpolorerProps {
  multi: boolean;
  onSelect: (any) => void;
}

class FileExplorer extends Component<
  IFileExpolorerProps,
  { selected_ids: number[]; media: MediaNode }
> {
  static contextTypes = {
    t: PropTypes.func,
  };

  page = 1;

  state = {
    media: {
      rows: [],
      count: 0,
    },
    selected_ids: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (page: number = 1) => {
    const result = await apolloClient().query<MediaQuery, MediaQueryVariables>({
      query: QUERY_MEDIA,
      variables: {
        filters: {
          page,
          authorId: 1,
        },
      },
    });

    if (result.data.media.rows) {
      const newState = {
        ...this.state.media,
        rows: [...this.state.media.rows, ...result.data.media.rows],
        count: this.state.media.count,
      };
      this.setState({ media: newState });
    }
  };

  onMediaSelected = (media: Media) => {
    const selected_ids: number[] = [...this.state.selected_ids];
    const index = selected_ids.indexOf(media.id);
    if (index >= 0) {
      selected_ids.splice(index, 1);
    } else if (selected_ids.length >= 0 && this.props.multi) {
      selected_ids.push(media.id);
      const selectedMediaUrls = this.state.media.rows
        .filter((media: Media) => selected_ids.indexOf(media.id) >= 0)
        .map((media: Media) => media.url);
      this.props.onSelect(selectedMediaUrls);
    }
    this.setState({ selected_ids });
  };

  loadMore = async (num: number) => {
    this.fetchData(num);
  };

  render() {
    const rows = (this.state.media as MediaNode).rows.map(media => (
      <FileItem
        key={media.id}
        media={media}
        isSelected={
          (this.state.selected_ids as number[]).indexOf(media.id) >= 0
        }
        onMediaSelected={this.onMediaSelected}
      />
    ));
    return (
      <StyledGrid className="grid">
        <InfiniteScrollList
          data={rows}
          count={this.state.media.count}
          loadMore={this.loadMore}
        />
      </StyledGrid>
    );
  }
}

export default FileExplorer;
