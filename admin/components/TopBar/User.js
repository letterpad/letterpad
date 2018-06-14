import React, { Component } from "react";
import appoloClient from "shared/apolloClient";
import { GET_AUTHOR } from "../../../shared/queries/Queries";
import config from "config";

class User extends Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.state = {
            open: false,
            author: {}
        };
    }
    async componentDidMount() {
        let response = await appoloClient.query({
            query: GET_AUTHOR,
            variables: { id: this.props.author.id },
            forceFetch: true,
            fetchPolicy: "network-only"
        });

        this.setState({ author: response.data.author });
    }

    toggleDropdown() {
        this.setState({ open: !this.state.open });
    }

    closeDropdown() {
        setTimeout(() => {
            this.setState({ open: false });
        }, 100);
    }
    render() {
        return (
            <div className="user-info" onMouseLeave={this.closeDropdown}>
                <div className={"dropdown" + (this.state.open ? " open" : "")}>
                    <a
                        className="dropdown-toggle"
                        onClick={this.toggleDropdown}
                    >
                        <img
                            src={
                                config.baseName +
                                (this.state.author.avatar ||
                                    "/admin/images/avatar.png")
                            }
                            className="avatar"
                        />
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu" style={{ marginLeft: -120 }}>
                        <li>
                            <a href={config.baseName + "/admin/login"}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default User;
