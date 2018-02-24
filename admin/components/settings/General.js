import React, { Component } from "react";
import PropTypes from "prop-types";

export default class General extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.state = {
            post_display: this.props.data.post_display.value
        };
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        const checked = { row: {}, grid: {} };

        if (this.state.post_display == "row") {
            checked.row.checked = true;
        } else {
            checked.grid.checked = true;
        }
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
                <div className="form-group">
                    <label className="custom-label">Posts display</label>
                    <div>
                        <label className="radio-inline">
                            <input
                                type="radio"
                                name="post_display"
                                {...checked.row}
                                onClick={() => {
                                    this.updateOption("post_display", "row");
                                    this.setState({ post_display: "row" });
                                }}
                            />Row
                        </label>
                        <label className="radio-inline">
                            <input
                                type="radio"
                                name="post_display"
                                {...checked.grid}
                                onClick={() => {
                                    this.updateOption("post_display", "grid");
                                    this.setState({ post_display: "grid" });
                                }}
                            />Grid
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

General.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
