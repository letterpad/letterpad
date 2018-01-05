import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { GET_AUTHORS } from "../../shared/queries/Queries";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import { Link } from "react-router-dom";

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
                <TableRowColumn>{author.email}</TableRowColumn>
                <TableRowColumn>
                    {author.fname + " " + author.lname}
                </TableRowColumn>
                <TableRowColumn>{author.role.name}</TableRowColumn>
                <TableRowColumn>
                    <Link
                        className="button"
                        to={"/admin/authors/edit/" + author.id}
                    >
                        <i className="material-icons">edit</i>
                    </Link>
                </TableRowColumn>
            </TableRow>
        ));
        return (
            <Card>
                <CardHeader
                    title="Authors"
                    subtitle="Overview of all your authors"
                />
                <CardText>
                    <Table onRowSelection={this.handleRowSelection}>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Role</TableHeaderColumn>
                                <TableHeaderColumn>Edit</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{rows}</TableBody>
                    </Table>
                </CardText>
            </Card>
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
