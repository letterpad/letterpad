import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { GET_AUTHORS } from "../../shared/queries/Queries";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "material-ui/Table";
import Card, { CardHeader, CardContent } from "material-ui/Card";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Paper from "material-ui/Paper/Paper";

class Authors extends Component {
    constructor(props) {
        super(props);
        this.authorSelect = this.authorSelect.bind(this);
        this.state = {
            selected: []
        };

        this.isSelected = this.isSelected.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
    }
    isSelected(index) {
        return this.state.selected.indexOf(index) !== -1;
    }
    handleRowSelection(selectedRows) {
        this.setState({
            selected: selectedRows
        });
    }
    authorSelect(id) {
        this.props.history.push("/admin/authors/edit/" + id);
    }
    render() {
        const rows = this.props.authors.map((author, i) => (
            <TableRow selected={this.isSelected(i)}>
                <TableCell>{author.email}</TableCell>
                <TableCell>{author.fname + " " + author.lname}</TableCell>
                <TableCell>{author.role.name}</TableCell>
                <TableCell>
                    <Link
                        className="button"
                        to={"/admin/authors/edit/" + author.id}
                    >
                        <i className="material-icons">edit</i>
                    </Link>
                </TableCell>
            </TableRow>
        ));
        return (
            <div>
                <PageHeader
                    title="Authors"
                    subtitle="Overview of all your authors"
                />
                <CardContent>
                    <Paper>
                        <Table onRowSelection={this.handleRowSelection}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{rows}</TableBody>
                        </Table>
                    </Paper>
                </CardContent>
            </div>
        );
    }
}

const ContainerWithData = graphql(GET_AUTHORS, {
    props: ({ data: { loading, authors } }) => ({
        authors,
        loading
    })
});

Authors.defaultProps = {
    authors: []
};
export default ContainerWithData(Authors);
