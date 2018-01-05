import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";

export default class General extends Component {
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
                        defaultValue={this.props.data.site_title.value}
                        floatingLabelText="Site title"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("site_title", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.site_tagline.value}
                        floatingLabelText="Site tagline"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("site_tagline", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.site_email.value}
                        floatingLabelText="Email"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("site_email", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.site_description.value}
                        floatingLabelText="Short description"
                        fullWidth={true}
                        multiLine={true}
                        rows={3}
                        rowsMax={4}
                        onChange={e =>
                            this.updateOption(
                                "site_description",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>
        );
    }
}

General.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
