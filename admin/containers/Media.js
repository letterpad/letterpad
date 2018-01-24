import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import MediaItem from "../components/MediaItem";
import { GET_MEDIA } from "../../shared/queries/Queries";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import PageHeader from "../components/PageHeader";
import moment from "moment";
import siteConfig from "../../config/site.config";
import PostsHoc from "./hoc/PostsHoc";
import CardContent from "material-ui/Card/CardContent";

const Paginate = ({ count }) => {
    const pages = Array.from(Array(Math.ceil(count / 3)));

    return (
        <ul className="pagination">
            {pages.map((_, i) => {
                const num = i + 1;
                return (
                    <li>
                        <Link to={"/admin/posts/" + num}>{num}</Link>
                    </li>
                );
            })}
        </ul>
    );
};
Paginate.propTypes = {
    count: PropTypes.number
};

class Media extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const mediaLink = media => {
            return (siteConfig.root_url + media.url)
                .replace(/\/\//g, "/")
                .replace(":/", "://");
        };
        const rows = this.props.media.rows.map((media, i) => (
            <TableRow>
                <TableCell>
                    <Link
                        style={{ display: "flex" }}
                        to={"/admin/media/" + media.id}
                    >
                        <img
                            height="75"
                            className="media-image"
                            src={media.url}
                        />
                    </Link>
                </TableCell>
                <TableCell>
                    <Link target="_blank" to={mediaLink(media)}>
                        {mediaLink(media)}
                    </Link>
                </TableCell>
                <TableCell>
                    {moment(new Date(media.created_at)).format("MMM Do, YY")}
                </TableCell>
                <TableCell>
                    <i className="material-icons">delete</i>
                </TableCell>
            </TableRow>
        ));
        const emptyRows =
            3 -
            Math.min(
                3,
                this.props.media.count - (this.props.variables.page - 1) * 3
            );

        return (
            <div>
                <PageHeader
                    title="Media"
                    subtitle="Find all your uploaded media here"
                />
                <CardContent>
                    <Paper>
                        <Table onRowSelection={this.handleRowSelection}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 49 * emptyRows }}
                                    >
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={this.props.media.count || 0}
                                        rowsPerPage={3}
                                        page={this.props.variables.page - 1}
                                        backIconButtonProps={{
                                            "aria-label": "Previous Page"
                                        }}
                                        nextIconButtonProps={{
                                            "aria-label": "Next Page"
                                        }}
                                        onChangePage={(e, page) => {
                                            this.props.changePage(e, page + 1);
                                        }}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Paper>
                </CardContent>
            </div>
        );
    }
}

const ContainerWithData = graphql(GET_MEDIA, {
    options: props => ({
        variables: {
            author_id: "1",
            offset: props.variables.offset,
            limit: props.variables.limit,
            page: props.variables.page
        }
    }),
    props: ({ data: { loading, media } }) => ({
        media,
        loading
    })
});

Media.propTypes = {
    media: PropTypes.object,
    loading: PropTypes.bool
};
Media.defaultProps = {
    media: {
        rows: []
    }
};
export default PostsHoc(ContainerWithData(Media));
