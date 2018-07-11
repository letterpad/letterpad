import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import ModalHoc from "../../components/ModalHoc";
import Loader from "../Loader";
import config from "../../../config";

class EditMediaInfo extends Component {
    static propTypes = {
        media: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        previous: PropTypes.func.isRequired,
        next: PropTypes.func.isRequired,
        updateMedia: PropTypes.func.isRequired,
        t: PropTypes.func
    };

    state = {
        media: {
            id: this.props.media.id,
            name: this.props.media.name,
            description: this.props.media.description
        },
        saving: false
    };

    itemName = React.createRef();

    static getDerivedStateFromProps(newProps, oldState) {
        if (oldState.media.id === newProps.media.id) return null;
        return {
            media: {
                id: newProps.media.id,
                name: newProps.media.name,
                description: newProps.media.description
            }
        };
    }

    componentDidMount() {
        this.itemName.current.focus();
    }

    onChange = (field, value) => {
        this.setState({ media: { ...this.state.media, [field]: value } });
    };

    goPrevious = e => {
        e.preventDefault();
        this.updateMedia();
        this.props.previous();
    };
    goNext = e => {
        e.preventDefault();
        this.updateMedia();
        this.props.next();
    };

    updateMedia = async e => {
        e.persist();
        // get the old values
        const { name, description } = this.props.media;
        // compare with current state to see if there is a change.
        if (
            this.state.media.name !== name ||
            this.state.media.description !== description
        ) {
            this.setState({ saving: true });
            // if yes, update the backend.
            const update = await this.props.updateMedia(this.state.media);
            if (update.data.updateMedia.ok) {
                this.setState({ saving: false });
            }
        }
        if (e && e.target.type == "button") {
            this.props.onClose();
        }
    };

    render() {
        const url = config.baseName + this.props.media.url;
        const { t } = this.props;
        return (
            <React.Fragment>
                <div className="modal-header">
                    <button onClick={this.props.onClose} className="close">
                        ×
                    </button>
                    <h4
                        className="modal-title"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingRight: 26
                        }}
                    >
                        <span>Add info to your media</span>
                    </h4>
                </div>
                <div className="modal-body text-center">
                    <div className="media-info-slider">
                        <div className="media-wrapper">
                            {this.state.saving && <Loader />}
                            <img src={url} />
                        </div>

                        <div className="media-info">
                            <div className="navigation">
                                <button
                                    className="btn btn-sm btn-dark"
                                    onClick={this.goPrevious}
                                >
                                    <i className="fa fa-long-arrow-left" />
                                </button>{" "}
                                <button
                                    className="btn btn-sm btn-dark"
                                    onClick={this.goNext}
                                >
                                    <i className="fa fa-long-arrow-right" />
                                </button>
                            </div>
                            <div className="form-group">
                                <label className="custom-label">Title</label>
                                <input
                                    value={this.state.media.name}
                                    className="form-control"
                                    placeholder="Give a name for this item"
                                    aria-invalid="false"
                                    ref={this.itemName}
                                    onChange={e =>
                                        this.onChange("name", e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label className="custom-label">
                                    Description
                                </label>
                                <textarea
                                    value={this.state.media.description}
                                    className="form-control"
                                    rows="2"
                                    placeholder="Write a short description about this item"
                                    aria-invalid="false"
                                    onChange={e =>
                                        this.onChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-xs btn-dark"
                        onClick={this.updateMedia}
                    >
                        Update
                    </button>
                    <button
                        onClick={this.props.onClose}
                        type="button"
                        className="btn btn-xs btn-default"
                    >
                        {t("common.cancel")}
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default translate("translations")(
    ModalHoc(EditMediaInfo, null, "full-width-modal")
);
