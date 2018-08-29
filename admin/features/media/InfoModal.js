import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import StyledInput from "../../components/input";
import StyledButton from "../../components/button";

import ModalHoc from "../../components/modal";
import Loader from "../../components/loader";
import config from "../../../config";

import StyledInfoModal from "./InfoModal.css";

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
            <StyledInfoModal>
                <ModalHoc
                    title="Add info to your media"
                    onClose={this.props.onClose}
                >
                    <div className="modal-body text-center">
                        <div className="media-container">
                            <div className="media-wrapper">
                                {this.state.saving && <Loader />}
                                <img src={url} />
                            </div>

                            <div className="media-info">
                                <div className="navigation">
                                    <StyledButton onClick={this.goPrevious}>
                                        <i className="fa fa-long-arrow-left" />
                                    </StyledButton>{" "}
                                    <StyledButton onClick={this.goNext}>
                                        <i className="fa fa-long-arrow-right" />
                                    </StyledButton>
                                </div>
                                <StyledInput
                                    label="Title"
                                    value={this.state.media.name}
                                    placeholder="Give a name for this item"
                                    innerRef={this.itemName}
                                    onChange={e =>
                                        this.onChange("name", e.target.value)
                                    }
                                />
                                <StyledInput
                                    label="Description"
                                    value={this.state.media.description}
                                    textarea
                                    rows="2"
                                    placeholder="Write a short description about this item"
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
                    <div className="modal-footer">
                        <StyledButton onClick={this.props.onClose}>
                            {t("common.cancel")}
                        </StyledButton>
                        <StyledButton success onClick={this.updateMedia}>
                            Update
                        </StyledButton>
                    </div>
                </ModalHoc>
            </StyledInfoModal>
        );
    }
}
export default translate("translations")(EditMediaInfo);
