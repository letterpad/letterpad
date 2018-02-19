import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { GET_AUTHORS } from "../../../shared/queries/Queries";

class ListItem extends Component {
    render() {
        return (
            <tr onClick={() => this.props.handleClick(this.props.author.id)}>
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
ListItem.propTypes = {
    author: PropTypes.object,
    handleClick: PropTypes.func
};
class Authors extends Component {
    constructor(props) {
        super(props);
        this.authorSelect = this.authorSelect.bind(this);
    }

    authorSelect(id) {
        this.props.history.push("/admin/authors/edit/" + id);
    }
    render() {
        if (this.props.loading) {
            return <div>hello</div>;
        }
        const rows = this.props.authors.map((author, i) => (
            <ListItem handleClick={this.authorSelect} key={i} author={author} />
        ));

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">Authors</div>
                    <div className="module-subtitle">
                        You can edit an author from here
                    </div>
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

Authors.propTypes = {
    history: PropTypes.object,
    authors: PropTypes.array,
    loading: PropTypes.bool
};

const ContainerWithData = graphql(GET_AUTHORS, {
    props: ({ data: { loading, authors } }) => ({
        authors,
        loading
    })
});

export default ContainerWithData(Authors);
