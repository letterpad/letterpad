import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "../Loader";
import { TableBody, TableRow, TableRowColumn } from "material-ui/Table";

export class Item extends Component {
    constructor(props) {
        super(props);
        this.isSelected = this.isSelected.bind(this);
    }

    postSelected(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    isSelected(index) {
        return this.props.rowSelected.indexOf(index) !== -1;
    }

    render() {
        const post = this.props.post;
        const categories = post.taxonomies
            .filter(item => item.type == "post_category")
            .map(cat => cat.name)
            .join(", ");

        const tags = post.taxonomies
            .filter(item => item.type == "post_tag")
            .map(tag => tag.name)
            .join(", ");

        return (
            <TableRow selected={this.isSelected(this.props.idx)}>
                <TableRowColumn
                    onClick={() => this.props.handleClick(this.props.post.id)}
                >
                    {this.props.post.title || "Draft.."}
                </TableRowColumn>
                <TableRowColumn>{categories}</TableRowColumn>
                <TableRowColumn>{tags}</TableRowColumn>
                <TableRowColumn>{this.props.post.status}</TableRowColumn>
                <TableRowColumn>
                    {this.props.post.author.username}
                </TableRowColumn>
                <TableRowColumn>
                    {moment(new Date(this.props.post.created_at)).format(
                        "MMM Do, YY"
                    )}
                </TableRowColumn>
            </TableRow>
        );
    }
}
