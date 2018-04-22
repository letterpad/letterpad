import React, { Component } from "react";
import { uploadFile } from "../../util";
import PropTypes from "prop-types";

export default class Basic extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.state = {
            avatar: this.props.data.avatar
        };
    }

    updateOption(option, value) {
        this.props.updateOption(option, value);
    }

    async uploadAvatar(files) {
        const avatar = await uploadFile({ files });
        this.updateOption("avatar", avatar);
        this.setState({ avatar });
    }

    updateAvatar(avatar) {
        this.updateOption("avatar", avatar);
        this.setState({ avatar });
    }

    render() {
        const { t } = this.context;
        const avatar = this.state.avatar || "/admin/images/avatar.png";
        return (
            <div>
                <div className="module-title">{t("profile.basic.title")}</div>
                <div className="module-subtitle">
                    {t("profile.basic.tagline")}
                </div>
                <div className="form-group">
                    <label className="custom-label">{t("common.fname")}</label>
                    <input
                        defaultValue={this.props.data.fname}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.fname.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("fname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label"> {t("common.lname")}</label>
                    <input
                        defaultValue={this.props.data.lname}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.lname.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("lname", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label"> {t("common.bio")}</label>
                    <input
                        defaultValue={this.props.data.bio}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.bio.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("bio", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label"> {t("common.email")}</label>
                    <input
                        defaultValue={this.props.data.email}
                        type="text"
                        className="form-control"
                        placeholder={t("profile.email.placeholder")}
                        aria-invalid="false"
                        onBlur={e => this.updateOption("email", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">Upload Avatar</label>
                    <div className="avatar-wrapper">
                        <div className="avatar-image">
                            <img alt="" src={avatar} />
                        </div>
                        {!this.state.avatar ? (
                            <a
                                href="#"
                                onClick={_ => this.refs.uploadInput.click()}
                            >
                                Add Avatar
                            </a>
                        ) : (
                            <a href="#" onClick={_ => this.updateAvatar("")}>
                                Remove Avatar
                            </a>
                        )}
                    </div>
                    <input
                        ref="uploadInput"
                        onChange={input =>
                            this.uploadAvatar(input.target.files)
                        }
                        type="file"
                        className="hide"
                        name="uploads[]"
                    />
                </div>
            </div>
        );
    }
}
Basic.contextTypes = {
    t: PropTypes.func
};
