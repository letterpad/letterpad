import React, { Component } from "react";

export default class PasswordChange extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
    }
    updateOption(option, value) {
        this.props.updateOption("password", value);
    }
    render() {
        return (
            <div>
                <div className="module-title">Change Password</div>
                <div className="module-subtitle">
                    Some basic information about yourself
                </div>

                <div className="form-group">
                    <label className="custom-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Change your password"
                        aria-invalid="false"
                        onChange={e =>
                            this.updateOption("password", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}
