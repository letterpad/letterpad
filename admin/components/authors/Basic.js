import React, { Component } from "react";
import TextField from "material-ui/TextField";
// import SelectField from "material-ui/SelectField";
// import MenuItem from "material-ui/MenuItem";

export default class Basic extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.state = {
            role_id: this.props.data.role.id
        };
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <TextField
                        label="First name"
                        fullWidth
                        defaultValue={this.props.data.fname}
                        onChange={e =>
                            this.updateOption("fname", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        label="Last Name"
                        fullWidth
                        defaultValue={this.props.data.lname}
                        onChange={e =>
                            this.updateOption("lname", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        label="Email"
                        fullWidth
                        defaultValue={this.props.data.email}
                        onChange={e =>
                            this.updateOption("email", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    {/*<SelectField
                        value={this.state.role_id}
                        onChange={(e, idx, value) => {
                            this.setState({ role_id: value });
                            this.updateOption("role_id", value);
                        }}
                        fullWidth
                        label="Role"
                    >
                        {this.props.roles.map((role, i) => {
                            return (
                                <MenuItem
                                    key={i}
                                    value={role.id}
                                    primaryText={role.name.toLowerCase()}
                                />
                            );
                        })}
                    </SelectField>*/}
                </div>
            </div>
        );
    }
}
