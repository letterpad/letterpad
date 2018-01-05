import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";

export default class Social extends Component {
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
                        defaultValue={this.props.data.social_facebook.value}
                        floatingLabelText="Facebook"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("social_facebook", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.social_twitter.value}
                        floatingLabelText="Twitter"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("social_twitter", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.social_instagram.value}
                        floatingLabelText="Instagram"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption(
                                "social_instagram",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>
        );
    }
}

Social.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
Social.defaultPropTypes = {
    data: JSON.stringify({
        social: {
            twitter: "",
            facebook: "",
            instagram: "",
            github: ""
        }
    })
};
