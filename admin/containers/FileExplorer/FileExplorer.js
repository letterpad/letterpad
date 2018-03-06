import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import FileItem from "./FileItem";
import { GET_MEDIA } from "../../../shared/queries/Queries";
import InfiniteScrollList from "../../components/InfiniteScrollList";

const limit = 6;

class FileExplorer extends Component {
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
        if (media.id === this.state.selected_id) {
            this.state.selected_id = 0;
        } else {
            this.state.selected_id = media.id;
            this.props.onSelect(media.url);
        }
        this.setState(this.state);
    }

    async loadMore(num) {
        let result = await this.props.fetchMore({
            author_id: this.props.author.id,
            offset: (num - 1) * limit,
            limit: limit
        });
        // this.setState({ page: num });
        this.page = num;
        this.forceUpdate();
    }

    render() {
        const rows = this.props.media.rows.map((media, i) => (
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
                                count={this.props.total}
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

const ContainerWithData = graphql(GET_MEDIA, {
    options: props => ({
        variables: {
            author_id: props.author.id,
            offset: (props.page - 1) * limit,
            limit: limit
        }
    }),
    props: ({ data: { loading, media, fetchMore } }) => {
        return {
            total: (media && media.count) || 0,
            media,
            loading,
            fetchMore: variables => {
                return fetchMore({
                    variables: variables,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            media: {
                                total: fetchMoreResult.media.count,
                                rows: [
                                    ...previousResult.media.rows,
                                    ...fetchMoreResult.media.rows
                                ]
                            }
                        };
                    }
                });
            }
        };
    }
});
FileExplorer.propTypes = {
    media: PropTypes.object,
    loading: PropTypes.bool,
    onPageClick: PropTypes.func
};
FileExplorer.defaultProps = {
    media: {
        rows: []
    },
    onPageClick: () => {}
};
FileExplorer.contextTypes = {
    t: PropTypes.func
};
export default ContainerWithData(FileExplorer);
