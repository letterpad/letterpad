import React, { Component } from "react";
import PropTypes from "prop-types";

export default class General extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.state = {
            post_display: this.props.data.post_display.value,
            layout_display: this.props.data.layout_display.value
        };
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    render() {
        const checked = { row: {}, grid: {}, "two-column": {}, centered: {} };
        const { t } = this.context;

        if (this.state.post_display == "row") {
            checked.row.checked = true;
        } else {
            checked.grid.checked = true;
        }
        if (this.state.layout_display == "centered") {
            checked.centered.checked = true;
        } else {
            checked["two-column"].checked = true;
        }
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.title")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_title.value}
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.general.site.title.placeholder"
                        )}
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("site_title", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.tagline")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_tagline.value}
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.general.site.tagline.placeholder"
                        )}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_tagline", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.email")}
                    </label>
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
                    <label className="custom-label">
                        {t("settings.general.site.description")}
                    </label>
                    <textarea
                        defaultValue={this.props.data.site_description.value}
                        className="form-control"
                        rows="2"
                        placeholder={t(
                            "settings.general.site.description.placeholder"
                        )}
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
                    <label className="custom-label">
                        {t("settings.general.site.url")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_url.value}
                        type="text"
                        className="form-control"
                        placeholder={t("settings.general.site.url.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_url", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.postDisplay")}
                    </label>
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
                            />
                            {t("common.row")}
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
                            />
                            {t("common.grid")}
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.layoutDisplay")}
                    </label>
                    <div>
                        <label className="radio-inline">
                            <input
                                type="radio"
                                name="layout_display"
                                {...checked.centered}
                                onClick={() => {
                                    this.updateOption(
                                        "layout_display",
                                        "centered"
                                    );
                                    this.setState({
                                        layout_display: "centered"
                                    });
                                }}
                            />
                            {t("common.centered")}
                        </label>
                        <label className="radio-inline">
                            <input
                                type="radio"
                                name="layout_display"
                                {...checked["two-column"]}
                                onClick={() => {
                                    this.updateOption(
                                        "layout_display",
                                        "two-column"
                                    );
                                    this.setState({
                                        layout_display: "two-column"
                                    });
                                }}
                            />
                            {t("common.fullWidth")}
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

General.contextTypes = {
    t: PropTypes.func
};
