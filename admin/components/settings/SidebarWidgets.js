import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField/TextField";

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
                    <TextField
                        defaultValue={
                            this.props.data.sidebar_latest_post_count.value
                        }
                        label="Total posts to display in sidebar"
                        fullWidth
                        onChange={e =>
                            this.updateOption(
                                "sidebar_latest_post_count",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="form-group">
                    <TextField
                        defaultValue={this.props.data.sidebar_about.value}
                        label="Introduction to display in sidebar"
                        fullWidth
                        multiLine
                        rows="4"
                        maxRows="5"
                        margin="normal"
                        onChange={e =>
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
