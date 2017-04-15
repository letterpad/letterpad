import React, { Component } from "react";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        Full Name
                    </label>
                    <input
                        defaultValue={this.props.data.profile_name.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter an epic title"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("profile_name", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        Old Password
                    </label>
                    <input
                        defaultValue={this.props.data.profile_password.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter an epic tagline"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption(
                                "profile_password",
                                e.target.value
                            )}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        New Password
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter an epic tagline"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption(
                                "profile_new_password",
                                e.target.value
                            )}
                    />
                </div>
            </div>
        );
    }
}
