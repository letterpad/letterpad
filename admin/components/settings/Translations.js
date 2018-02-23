import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Translations extends Component {
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
                    <label className="custom-label">
                        Search results not found
                    </label>
                    <input
                        defaultValue={this.props.data.text_notfound.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter a text"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("text_notfound", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Posts empty</label>
                    <input
                        defaultValue={this.props.data.text_posts_empty.value}
                        type="text"
                        className="form-control"
                        placeholder="Enter your facebook link"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption(
                                "text_posts_empty",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>
        );
    }
}

Translations.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};
Translations.defaultPropTypes = {
    data: JSON.stringify({
        text_notfound: ""
    })
};
