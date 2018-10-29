import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledInput from "../../components/input";
import StyledTitleHeader from "../../components/title-header";

import { uploadFile } from "../../util";
import config from "config";

class Basic extends Component {
  static propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func,
    t: PropTypes.func,
  };

  uploadInputRef = React.createRef();

  state = {
    avatar: this.props.data.avatar,
  };

  updateOption = (option, value) => {
    this.props.updateOption(option, value);
  };

  uploadAvatar = async files => {
    const avatar = await uploadFile({ files });
    this.updateOption("avatar", avatar);
    this.setState({ avatar });
  };

  updateAvatar = avatar => {
    this.updateOption("avatar", avatar);
    this.setState({ avatar });
  };

  render() {
    const { t } = this.props;
    const avatar = this.state.avatar || "/admin/images/avatar.png";
    return (
      <section>
        <StyledTitleHeader
          title={t("profile.basic.title")}
          subtitle={t("profile.basic.tagline")}
        />
        <StyledInput
          label={t("common.fname")}
          defaultValue={this.props.data.fname}
          type="text"
          placeholder={t("profile.fname.placeholder")}
          onBlur={e => this.updateOption("fname", e.target.value)}
        />

        <StyledInput
          label={t("common.lname")}
          defaultValue={this.props.data.lname}
          type="text"
          placeholder={t("profile.lname.placeholder")}
          onBlur={e => this.updateOption("lname", e.target.value)}
        />

        <StyledInput
          label={t("common.bio")}
          defaultValue={this.props.data.bio}
          type="text"
          placeholder={t("profile.bio.placeholder")}
          onBlur={e => this.updateOption("bio", e.target.value)}
        />

        <StyledInput
          label={t("common.email")}
          defaultValue={this.props.data.email}
          type="text"
          className="form-control"
          placeholder={t("profile.email.placeholder")}
          aria-invalid="false"
          onBlur={e => this.updateOption("email", e.target.value)}
        />

        <section>
          <label className="custom-label">Upload Avatar</label>
          <section className="avatar-wrapper">
            <section className="avatar-image">
              <img alt="" src={config.baseName + avatar} />
            </section>
            {!this.state.avatar ? (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  this.uploadInputRef.current.click();
                }}
              >
                Add Avatar
              </a>
            ) : (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  this.updateAvatar("");
                }}
              >
                Remove Avatar
              </a>
            )}
          </section>
          <input
            ref={this.uploadInputRef}
            onChange={input => this.uploadAvatar(input.target.files)}
            type="file"
            className="hide"
            name="uploads[]"
          />
        </section>
      </section>
    );
  }
}

export default translate("translations")(Basic);
