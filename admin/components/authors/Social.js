import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";

export default class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            social: {}
        };
        this.updateOption = this.updateOption.bind(this);
    }
    componentWillMount() {
        this.state.social = JSON.parse(this.props.data);
        this.setState(this.state);
    }

    updateOption(option, value) {
        this.state.social[option] = value;
        this.setState(this.state);
        this.props.updateOption("social", JSON.stringify(this.state.social));
    }
    render() {
        return (
            <div>
                <div className="form-group">
                    <TextField
                        value={this.state.social.twitter}
                        floatingLabelText="Your twitter username"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("twitter", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        value={this.state.social.facebook}
                        floatingLabelText="Your facebook username"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("facebook", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        value={this.state.social.instagram}
                        floatingLabelText="Your instagram username"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("instagram", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        value={this.state.social.github}
                        floatingLabelText="Your github username"
                        fullWidth={true}
                        onChange={e =>
                            this.updateOption("github", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}

Social.propTypes = {
    data: PropTypes.string,
    updateOption: PropTypes.func
};

Social.defaultProps = {
    data: JSON.stringify({
        twitter: "",
        github: "",
        instagram: "",
        facebook: ""
    })
};
