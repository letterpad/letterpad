import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { Item } from "../components/posts/TableRow";
import { GET_POSTS } from "../../shared/queries/Queries";
import PostsHoc from "./hoc/PostsHoc";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination
} from "material-ui/Table";
import Card, { CardHeader, CardContent } from "material-ui/Card";
import Paper from "material-ui/Paper";
import PageHeader from "../components/PageHeader";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "publish",
            loading: true,
            posts: null,
            selected: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
    }

    handleClick(id) {
        this.props.history.push("/admin/posts/" + id);
    }

    handleRowSelection(selectedRows) {
        this.setState({
            selected: selectedRows
        });
    }
    isSelected(index) {
        return this.state.selected.indexOf(index) !== -1;
    }
    getTaxonomy(type, taxonomies) {
        return taxonomies
            .filter(item => item.type == type)
            .map(tax => tax.name)
            .join(", ");
    }
    render() {
        const loading = this.props.loading || !this.props.networkStatus === 2;

        const { status } = this.props.variables;

        const rows = this.props.posts.rows.map((post, i) => (
            <TableRow selected={this.isSelected(i)}>
                <TableCell>{post.title || "Draft.."}</TableCell>
                <TableCell>
                    {this.getTaxonomy("post_category", post.taxonomies)}
                </TableCell>
                <TableCell>
                    {this.getTaxonomy("post_tag", post.taxonomies)}
                </TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>{post.author.username}</TableCell>
                <TableCell>
                    {moment(new Date(post.created_at)).format("MMM Do, YY")}
                </TableCell>
                <TableCell>
                    <Link className="button" to={"/admin/posts/" + post.id}>
                        <i className="material-icons">edit</i>
                    </Link>
                </TableCell>
            </TableRow>
        ));
        const emptyRows =
            3 -
            Math.min(
                3,
                this.props.posts.count - (this.props.variables.page - 1) * 3
            );
        return (
            <div>
                <PageHeader
                    title="Posts"
                    subtitle="Overview of all your blog posts"
                />
                <CardContent>
                    <PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />
                    <Paper>
                        <Table onRowSelection={this.handleRowSelection}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Categories</TableCell>
                                    <TableCell>Tags</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Edit</TableCell>
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
                                        count={this.props.posts.count || 0}
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

const ContainerWithData = graphql(GET_POSTS, {
    options: props => {
        return {
            variables: {
                ...props.variables,
                type: "post"
            },
            forceFetch: true,
            fetchPolicy: "network-only"
        };
    },
    props: ({ data: { loading, posts, networkStatus } }) => ({
        posts,
        loading,
        networkStatus
    })
});
Posts.propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    changeStatus: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.object
};
Posts.defaultProps = {
    posts: {
        rows: []
    }
};
export default PostsHoc(ContainerWithData(Posts));
