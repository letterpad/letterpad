import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SidebarWidgets extends Component {
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
                    <label className="custom-label">Latest Post Count</label>
                    <input
                        defaultValue={
                            this.props.data.sidebar_latest_post_count.value
                        }
                        type="text"
                        className="form-control"
                        placeholder="Total posts to display"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption(
                                "sidebar_latest_post_count",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">About</label>
                    <textarea
                        defaultValue={this.props.data.sidebar_about.value}
                        className="form-control"
                        rows="7"
                        placeholder="Introduce your site"
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("sidebar_about", e.target.value)
                        }
                    />
                </div>
            </div>
        );
    }
}
SidebarWidgets.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
