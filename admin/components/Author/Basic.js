import React, { Component } from "react";

export default class Basic extends Component {
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
                <div className="module-title">Basic Information</div>
                <div className="module-subtitle">
                    Some basic information about yourself
                </div>
                <div className="form-group">
                    <label className="custom-label">First name</label>
                    <input
                        defaultValue={this.props.data.fname}
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        aria-invalid="false"
                        onBlur={e => this.updateOption("fname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Last Name</label>
                    <input
                        defaultValue={this.props.data.lname}
                        type="text"
                        className="form-control"
                        placeholder="Enter your last name"
                        aria-invalid="false"
                        onBlur={e => this.updateOption("lname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Email</label>
                    <input
                        defaultValue={this.props.data.email}
                        type="text"
                        className="form-control"
                        placeholder="Enter your email"
                        aria-invalid="false"
                        onBlur={e => this.updateOption("email", e.target.value)}
                    />
                </div>
            </div>
        );
    }
}
