import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import PostsHoc from "./hoc/PostsHoc";
import { GET_POSTS } from "../../shared/queries/Queries";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";

class Pages extends Component {
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
        this.props.history.push("/admin/pages/" + id);
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
                <TableRowColumn onClick={() => this.handleClick(post.id)}>
                    {post.title || "Draft.."}
                </TableRowColumn>
                <TableRowColumn>
                    {this.getTaxonomy("post_category", post.taxonomies)}
                </TableRowColumn>
                <TableRowColumn>
                    {this.getTaxonomy("post_tag", post.taxonomies)}
                </TableRowColumn>
                <TableRowColumn>{post.status}</TableRowColumn>
                <TableRowColumn>{post.author.username}</TableRowColumn>
                <TableRowColumn>
                    {moment(new Date(post.created_at)).format("MMM Do, YY")}
                </TableRowColumn>
                <TableRowColumn>
                    <Link className="button" to={"/admin/pages/" + post.id}>
                        <i className="material-icons">edit</i>
                    </Link>
                </TableRowColumn>
            </TableRow>
        ));
        return (
            <Card>
                <CardHeader
                    title="Posts"
                    subtitle="Overview of all your blog posts"
                />
                <CardText>
                    <PostFilters
                        changeStatus={this.props.changeStatus}
                        selectedStatus={status}
                    />
                    <Table onRowSelection={this.handleRowSelection}>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Title</TableHeaderColumn>
                                <TableHeaderColumn>
                                    Categories
                                </TableHeaderColumn>
                                <TableHeaderColumn>Tags</TableHeaderColumn>
                                <TableHeaderColumn>Status</TableHeaderColumn>
                                <TableHeaderColumn>Author</TableHeaderColumn>
                                <TableHeaderColumn>
                                    Created At
                                </TableHeaderColumn>
                                <TableHeaderColumn>Edit</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{rows}</TableBody>
                    </Table>

                    {!loading && (
                        <Paginate
                            count={this.props.posts.count}
                            page={this.props.variables.page}
                            changePage={this.props.changePage}
                        />
                    )}
                </CardText>
            </Card>
        );
    }
}

const ContainerWithData = graphql(GET_POSTS, {
    options: props => ({
        variables: {
            ...props.variables,
            type: "page"
        },
        forceFetch: true,
        fetchPolicy: "network-only"
    }),
    props: ({ data: { loading, posts, networkStatus } }) => ({
        posts,
        loading,
        networkStatus
    })
});

Pages.propTypes = {
    posts: PropTypes.object,
    changePage: PropTypes.func,
    variables: PropTypes.object,
    changeStatus: PropTypes.func,
    loading: PropTypes.bool,
    history: PropTypes.object
};
Pages.defaultProps = {
    posts: {
        rows: []
    }
};
export default PostsHoc(ContainerWithData(Pages));
