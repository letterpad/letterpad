import React, { Component } from "react";
import PropTypes from "prop-types";

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
                    <label className="custom-label">Site title</label>
                    <input
                        defaultValue={this.props.data.site_title.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter an epic title"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("site_title", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Tagline</label>
                    <input
                        defaultValue={this.props.data.site_tagline.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter an epic tagline"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_tagline", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Email</label>
                    <input
                        defaultValue={this.props.data.site_email.value}
                        type="email"
                        className="form-control"
                        placeholder="someone@somewhere.com"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_email", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Short description</label>
                    <textarea
                        defaultValue={this.props.data.site_description.value}
                        className="form-control"
                        rows="7"
                        placeholder="What is your site all about ? This will be used for SEO"
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
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
