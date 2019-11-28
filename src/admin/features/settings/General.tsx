import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import styled from "styled-components";
import { notify } from "react-notify-toast";

import config from "config";
import { uploadFile } from "../../server/util";
import Input from "../../components/input";
import StyledSelect from "../../components/select";

const ImageWrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  .logo-image,
  .banner-image {
    display: flex;
    align-items: center;
  }
  label {
    color: var(--base-shade-3);
    font-weight: 500;
    font-size: 13px;
    display: inline-block;
    max-width: 100%;
    margin-bottom: 15px;
  }
  .material-icons {
    font-size: 18px !important;
  }
  .danger {
    color: #9e1b1b;
  }
`;

class General extends Component {
  static propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func,
    t: PropTypes.func,
    i18n: PropTypes.object,
  };

  uploadLogoInputRef = React.createRef();

  uploadBannerRef = React.createRef();

  state = {
    banner: this.props.data.banner.value,
    site_logo: this.props.data.site_logo.value,
  };

  langOptions = JSON.parse(this.props.data.locale.value);

  updateOption = (option, value) => {
    this.props.updateOption(option, value);
  };

  switchLanguage = value => {
    const locales = {};
    Object.keys(this.langOptions).map(lang => {
      locales[lang] = value === lang;
    });

    this.updateOption("locale", JSON.stringify(locales));
    const { i18n } = this.props;
    i18n.changeLanguage(value);
  };

  uploadBanner = async files => {
    const uploadedFiles = await uploadFile({ files });
    let { src, errors } = uploadedFiles[0];
    if (errors) {
      notify.show(errors, "error", 3000);
      return;
    }
    this.updateOption("banner", src);
    this.setState({ banner: src });
  };

  uploadLogo = async files => {
    const uploadedFiles = await uploadFile({ files });
    let { src, errors } = uploadedFiles[0];
    if (errors) {
      notify.show(errors, "error", 3000);
      return;
    }
    this.updateOption("site_logo", src);
    this.setState({ site_logo: src });
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

    let selectedLanguage = "en";
    const langOptions = Object.keys(this.langOptions).map(key => {
      if (this.langOptions[key]) {
        selectedLanguage = key;
      }
      return {
        name: key,
        value: key,
      };
    });

    return (
      <div>
        <Input
          label={t("settings.general.site.title")}
          defaultValue={this.props.data.site_title.value}
          type="text"
          placeholder={t("settings.general.site.title.placeholder")}
          onBlur={e => this.updateOption("site_title", e.target.value)}
        />
        <Input
          label={t("settings.general.site.tagline")}
          defaultValue={this.props.data.site_tagline.value}
          type="text"
          placeholder={t("settings.general.site.tagline.placeholder")}
          onBlur={e => this.updateOption("site_tagline", e.target.value)}
        />
        <Input
          label={t("settings.general.site.email")}
          defaultValue={this.props.data.site_email.value}
          type="email"
          placeholder="someone@somewhere.com"
          onBlur={e => this.updateOption("site_email", e.target.value)}
        />
        <Input
          label={t("settings.general.site.description")}
          textarea
          defaultValue={this.props.data.site_description.value}
          rows="2"
          placeholder={t("settings.general.site.description.placeholder")}
          required=""
          onBlur={e => this.updateOption("site_description", e.target.value)}
        />
        <Input
          label={t("settings.general.site.url")}
          defaultValue={this.props.data.site_url.value}
          type="text"
          placeholder={t("settings.general.site.url.placeholder")}
          onBlur={e => this.updateOption("site_url", e.target.value)}
        />
        <Input
          label={t("settings.general.site.footer") + "(html allowed)"}
          textarea
          defaultValue={this.props.data.site_footer.value}
          className="form-control"
          rows="2"
          placeholder={t("settings.general.site.footer.placeholder")}
          required=""
          onBlur={e => this.updateOption("site_footer", e.target.value)}
        />
        <ImageWrapper>
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
                <i className="material-icons">add</i>
              </a>
            ) : (
              <div className="logo-image">
                <img width="100" alt="" src={config.baseName + site_logo} />
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    this.updateLogo("");
                  }}
                >
                  <i className="material-icons danger">delete</i>
                </a>
              </div>
            )}
          </div>
          <input
            ref={this.uploadLogoInputRef}
            onChange={input => this.uploadLogo(input.target.files)}
            type="file"
            className="hide"
            name="uploads[]"
          />
        </ImageWrapper>
        <ImageWrapper>
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
                <i className="material-icons">add</i>
              </a>
            ) : (
              <div className="banner-image">
                <img width="300" alt="" src={config.baseName + banner} />
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    this.updateBanner("");
                  }}
                >
                  <i className="material-icons danger">delete</i>
                </a>
              </div>
            )}
          </div>
          <input
            ref={this.uploadBannerRef}
            onChange={input => this.uploadBanner(input.target.files)}
            type="file"
            className="hide"
            name="uploads[]"
          />
        </ImageWrapper>
        <Input
          label={t("settings.general.site.ga")}
          defaultValue={this.props.data.google_analytics.value}
          type="text"
          placeholder={t("settings.general.site.ga.placeholder")}
          onBlur={e => this.updateOption("google_analytics", e.target.value)}
        />
        <StyledSelect
          label="Select language"
          selected={selectedLanguage}
          options={langOptions}
          onChange={this.switchLanguage}
        />
      </div>
    );
  }
}

export default translate("translations")(General);
