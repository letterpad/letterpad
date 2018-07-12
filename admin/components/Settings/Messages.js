import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

class Messages extends Component {
    updateOption = (option, value) => {
        this.props.updateOption(option, value);
    };

    render() {
        const { t } = this.props;
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

Messages.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func,
    t: PropTypes.func
};

Messages.defaultPropTypes = {
    data: JSON.stringify({
        text_notfound: ""
    })
};

export default translate("translations")(Messages);
