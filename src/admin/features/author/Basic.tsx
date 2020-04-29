import React, { Component } from "react";

import StyledInput from "../../components/input";
import StyledTitleHeader from "../../components/title-header";
import config from "../../../config";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";
import { uploadFile } from "../../server/util";

const host = config.ROOT_URL + config.BASE_NAME;

class Basic extends Component<any, any> {
  uploadInputRef = React.createRef<HTMLInputElement>();

  state = {
    avatar: this.props.data.avatar,
  };

  updateOption = (option: string, value: string) => {
    this.props.updateOption(option, value);
  };

  uploadAvatar = async (files: FileList) => {
    const uploadedFiles = await uploadFile({ files });
    const { src, errors } = uploadedFiles[0];
    if (errors) {
      notify.show(errors, "error", 3000);
      return;
    }
    this.updateOption("avatar", src.replace(host, ""));
    this.setState({ avatar: src });
  };

  updateAvatar = (avatar: string) => {
    this.updateOption("avatar", avatar);
    this.setState({ avatar });
  };

  render() {
    const { t } = this.props;
    const avatar = this.state.avatar || "/admin/images/avatar.png";
    return (
      <section>
        <StyledInput
          label={t("common.name")}
          defaultValue={this.props.data.name}
          type="text"
          placeholder={t("profile.name.placeholder")}
          onBlur={e => this.updateOption("name", e.target.value)}
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
              <img width="80px" alt="" src={avatar} />
            </section>
            {!this.state.avatar ? (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (this.uploadInputRef.current) {
                    this.uploadInputRef.current.click();
                  }
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
            onChange={input =>
              input.target.files && this.uploadAvatar(input.target.files)
            }
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
