import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Link } from "react-router";
import moment from "moment";
import { browserHistory } from "react-router";

class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr>
                <td align="center">
                    <input
                        type="checkbox"
                        className="checkthis"
                        value={this.props.author.id}
                    />
                </td>
                <td style={{ cursor: "pointer" }}>
                    {this.props.author.username}
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
            <div className={"wrapper "}>
                <section className="module-xs">
                    <div className="container-fluid container-custom">
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th className="col-check">
                                        <input type="checkbox" />
                                    </th>
                                    <th className="col-text">Username</th>
                                    <th className="col-text">Role</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }
}
const optionsQuery = gql`
  query getAuthors{
  authors{
    username,
    role {
      name
      permissions {
        name
      }
    }
  }
}
`;

const ContainerWithData = graphql(optionsQuery, {
    props: ({ data: { loading, authors } }) => ({
        authors,
        loading
    })
});

export default ContainerWithData(Authors);
