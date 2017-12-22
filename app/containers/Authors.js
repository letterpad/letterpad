import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Link } from "react-router";
import moment from "moment";
import { browserHistory } from "react-router";
import { GET_AUTHORS } from "../../shared/queries/Queries";

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.authorSelected = this.authorSelected.bind(this);
    }

    authorSelected() {
        browserHistory.push("/admin/authors/edit/" + this.props.author.id);
    }

    render() {
        return (
            <tr onClick={this.authorSelected}>
                <td align="center">
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            className="checkthis"
                            value={this.props.author.id}
                        />
                        <div className="control__indicator" />
                    </label>
                </td>
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

class Authors extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <div>hello</div>;
        }
        let rows = this.props.authors.map((author, i) => {
            return <ListItem key={i} author={author} />;
        });

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Authors</div>
                    <div className="module-subtitle">[...]</div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th width="5%" className="col-check">
                                    <input type="checkbox" />
                                </th>
                                <th width="20%" className="col-text">
                                    Email
                                </th>
                                <th width="10%" className="col-text">
                                    Name
                                </th>
                                <th width="10%" className="col-text">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            </section>
        );
    }
}

const ContainerWithData = graphql(GET_AUTHORS, {
    props: ({ data: { loading, authors } }) => ({
        authors,
        loading
    })
});

export default ContainerWithData(Authors);
