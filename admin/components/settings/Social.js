import React, { Component } from "react";
import PropTypes from "prop-types";

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
                    <label className="custom-label">Facebook</label>
                    <input
                        defaultValue={this.props.data.social_facebook.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter your facebook link"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("social_facebook", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Twitter</label>
                    <input
                        defaultValue={this.props.data.social_twitter.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter your twitter link"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("social_twitter", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Instagram</label>
                    <input
                        defaultValue={this.props.data.social_instagram.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter your instagram link.."
                        aria-invalid="true"
                        onBlur={e =>
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
        social_twitter: "",
        social_instagram: "",
        social_facebook: "",
        social_github: ""
    })
};
