import React, { Component } from "react";
import PropTypes from "prop-types";
import FileItem from "./FileItem";
import InfiniteScrollList from "../../components/InfiniteScrollList";
import GetMedia from "../../data-connectors/GetMedia";
import config from "../../../config";

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
    constructor(props) {
        super(props);
        this.page = 1;
        this.state = {
            selected_id: 0
        };
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    onMediaSelected(media) {
        const newState = {};
        if (media.id === this.state.selected_id) {
            newState.selected_id = 0;
        } else {
            newState.selected_id = media.id;
            this.props.onSelect(media.url);
        }
        this.setState(newState);
    }

    async loadMore(num) {
        await this.props.fetchMore({
            author_id: this.props.author.id,
            offset: (num - 1) * config.itemsPerPage,
            limit: config.itemsPerPage,
            merge: true
        });
        this.page = num;
        this.forceUpdate();
    }

    render() {
        const rows = this.props.media.rows.map(media => (
            <FileItem
                key={media.id}
                media={media}
                selected_id={this.state.selected_id}
                onMediaSelected={this.onMediaSelected}
            />
        ));
        const { t } = this.context;
        return (
            <section className="module-xs">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="media-grid">
                            <InfiniteScrollList
                                data={rows}
                                count={this.props.count}
                                page={this.page}
                                loadMore={this.loadMore}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default GetMedia(FileExplorer);
