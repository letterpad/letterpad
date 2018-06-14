import React, { Component } from "react";
import PropTypes from "prop-types";

export default class AuthorRow extends Component {
    static propTypes = {
        author: PropTypes.object,
        handleClick: PropTypes.func
    };

    render() {
        return (
            <tr onClick={() => this.props.handleClick(this.props.author.id)}>
                <td style={{ cursor: "pointer" }}>{this.props.author.email}</td>
                <td style={{ cursor: "pointer" }}>
                    {this.props.author.fname + " " + this.props.author.lname}
                </td>
                <td style={{ cursor: "pointer" }}>
                    {this.props.author.role.name}
                </td>
            </tr>
        );
    }
}
