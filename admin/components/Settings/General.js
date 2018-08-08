import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import config from "config";
import { uploadFile } from "../../util";

class General extends Component {
    static propTypes = {
        data: PropTypes.object,
        updateOption: PropTypes.func,
        t: PropTypes.func,
        i18n: PropTypes.object
    };

    uploadLogoInputRef = React.createRef();
    uploadBannerRef = React.createRef();

    state = {
        banner: this.props.data.banner.value,
        site_logo: this.props.data.site_logo.value
    };

    langOptions = JSON.parse(this.props.data.locale.value);

    updateOption = (option, value) => {
        this.props.updateOption(option, value);
    };

    switchLanguage = e => {
        const locales = {};
        Object.keys(this.langOptions).map(lang => {
            locales[lang] = e.target.value === lang;
        });

        this.updateOption("locale", JSON.stringify(locales));
        const { i18n } = this.props;
        i18n.changeLanguage(e.target.value);
    };

    uploadBanner = async files => {
        const uploadedFiles = await uploadFile({ files });
        let banner = uploadedFiles[0];
        this.updateOption("banner", banner);
        this.setState({ banner });
    };

    uploadLogo = async files => {
        const uploadedFiles = await uploadFile({ files });
        let site_logo = uploadedFiles[0];
        this.updateOption("site_logo", site_logo);
        this.setState({ site_logo });
    };

    updateBanner = banner => {
        this.updateOption("banner", banner);
        this.setState({ banner });
    };

    updateLogo = site_logo => {
        this.updateOption("site_logo", site_logo);
        this.setState({ site_logo });
    };

    render() {
        const { t } = this.props;
        const banner = this.state.banner || "";
        const site_logo = this.state.site_logo || "";
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
                        {t("settings.general.site.footer")} (html allowed)
                    </label>
                    <textarea
                        defaultValue={this.props.data.site_footer.value}
                        className="form-control"
                        rows="2"
                        placeholder={t(
                            "settings.general.site.footer.placeholder"
                        )}
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("site_footer", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Upload Logo</label>
                    <div className="logo-wrapper">
                        {!this.state.site_logo ? (
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.uploadLogoInputRef.current.click();
                                }}
                            >
                                Add Logo
                            </a>
                        ) : (
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.updateLogo("");
                                }}
                            >
                                <div className="logo-image">
                                    <img
                                        width="100"
                                        alt=""
                                        src={config.baseName + site_logo}
                                    />
                                </div>
                                Remove Logo
                            </a>
                        )}
                    </div>
                    <input
                        ref={this.uploadLogoInputRef}
                        onChange={input => this.uploadLogo(input.target.files)}
                        type="file"
                        className="hide"
                        name="uploads[]"
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Upload Hero Banner</label>
                    <div className="banner-wrapper">
                        {!this.state.banner ? (
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.uploadBannerRef.current.click();
                                }}
                            >
                                Add Banner
                            </a>
                        ) : (
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    this.updateBanner("");
                                }}
                            >
                                <div className="banner-image">
                                    <img
                                        width="300"
                                        alt=""
                                        src={config.baseName + banner}
                                    />
                                </div>
                                Remove Banner
                            </a>
                        )}
                    </div>
                    <input
                        ref={this.uploadBannerRef}
                        onChange={input =>
                            this.uploadBanner(input.target.files)
                        }
                        type="file"
                        className="hide"
                        name="uploads[]"
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.ga")}
                    </label>
                    <input
                        defaultValue={this.props.data.google_analytics.value}
                        type="text"
                        className="form-control"
                        placeholder={t("settings.general.site.ga.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption(
                                "google_analytics",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.language")}
                    </label>
                    <select
                        onChange={this.switchLanguage}
                        className="form-control"
                    >
                        {Object.keys(this.langOptions).map((key, i) => {
                            const selected = this.langOptions[key]
                                ? { selected: "selected" }
                                : {};
                            return (
                                <option key={i} {...selected} value={key}>
                                    {key}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}

export default translate("translations")(General);
