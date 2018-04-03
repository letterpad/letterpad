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
        const { t } = this.context;
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.messages.translationNotFound")}
                    </label>
                    <input
                        defaultValue={this.props.data.text_notfound.value}
                        type="text"
                        className="form-control"
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("text_notfound", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.messages.emptyPost")}
                    </label>
                    <input
                        defaultValue={this.props.data.text_posts_empty.value}
                        type="text"
                        className="form-control"
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

Translations.contextTypes = {
    t: PropTypes.func
};
