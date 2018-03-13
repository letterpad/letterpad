import React, { Component } from "react";

class User extends Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.state = {
            open: false
        };
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
                        <img src="/images/avatar.png" className="avatar" />
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu" style={{ marginLeft: -120 }}>
                        <li>
                            <a href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default User;
