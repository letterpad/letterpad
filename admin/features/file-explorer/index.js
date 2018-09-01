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
`;
class FileExplorer extends Component {
    static propTypes = {
        media: PropTypes.object,
        author: PropTypes.object,
        loading: PropTypes.bool,
        onPageClick: PropTypes.func,
        onSelect: PropTypes.func,
        fetchMore: PropTypes.func,
        count: PropTypes.number
    };

    static defaultProps = {
        media: {
            rows: []
        },
        onPageClick: () => {}
    };

    static contextTypes = {
        t: PropTypes.func
    };

    page = 1;

    state = {
        selected_id: 0
    };

    onMediaSelected = media => {
        const newState = {};
        if (media.id === this.state.selected_id) {
            newState.selected_id = 0;
        } else {
            newState.selected_id = media.id;
            this.props.onSelect(media.url);
        }
        this.setState(newState);
    };

    loadMore = async num => {
        await this.props.fetchMore({
            author_id: this.props.author.id,
            offset: (num - 1) * config.mediaPerPage,
            limit: config.mediaPerPage,
            merge: true
        });
        this.page = num;
        this.forceUpdate();
    };

    render() {
        const rows = this.props.media.rows.map(media => (
            <FileItem
                key={media.id}
                media={media}
                selected_id={this.state.selected_id}
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
