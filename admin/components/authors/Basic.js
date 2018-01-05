import React, { Component } from "react";
import TextField from "material-ui/TextField";

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
                <div className="form-group">
                    <TextField
                        floatingLabelText="First name"
                        fullWidth={true}
                        defaultValue={this.props.data.fname}
                        onChange={e =>
                            this.updateOption("fname", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        floatingLabelText="Last Name"
                        fullWidth={true}
                        defaultValue={this.props.data.lname}
                        onChange={e =>
                            this.updateOption("lname", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        floatingLabelText="Email"
                        fullWidth={true}
                        defaultValue={this.props.data.email}
                        onChange={e =>
                            this.updateOption("email", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}
