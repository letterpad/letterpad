import React, { Component } from "react";
import TextField from "material-ui/TextField";

export default class Social extends Component {
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
                <div className="form-group">
                    <TextField
                        floatingLabelText="Enter your new password"
                        fullWidth={true}
                        type="password"
                        onChange={e =>
                            this.updateOption("password", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}
