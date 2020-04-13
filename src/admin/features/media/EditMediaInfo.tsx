import React, { Component } from "react";
import StyledInput, { TextArea } from "../../components/input";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../components/button";
import Loader from "../../components/loader";
import { Media } from "../../../__generated__/gqlTypes";
import ModalHoc from "../../components/modal";
import StyledInfoModal from "./InfoModal.css";

interface IEditMediaInfoProps extends WithNamespaces {
  media: Media[];
  onClose: () => void;
  deleteMedia: (id: number, index: Media[]) => void;
  updateMedia: (media: Media, index: Media[]) => void;
  index: number;
}

class EditMediaInfo extends Component<IEditMediaInfoProps, any> {
  state = {
    media: this.props.media,
    saving: false,
    index: this.props.index,
  };

  itemName = React.createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.itemName.current) {
      this.itemName.current.focus();
    }
    window.addEventListener("keyup", this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyPress);
  }

  handleKeyPress = ({ keyCode }: { keyCode: number }) => {
    if (keyCode === 37) {
      this.goPrevious();
    } else if (keyCode === 39) {
      this.goNext();
    }
  };

  onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target;
    if (e.target["name"]) {
      const changedMedia = this.state.media.map((item, idx) => {
        if (idx === this.state.index) {
          return { ...item, [e.target["name"]]: value };
        }
        return item;
      });
      this.setState({ media: changedMedia });
    }
  };

  goPrevious = (e?: React.SyntheticEvent) => {
    e && e.preventDefault();
    const { index, media } = this.state;
    const newState = { index: index - 1 };
    const isFirstImage = index === 0;
    if (isFirstImage) {
      newState.index = media.length - 1;
    }
    this.setState(newState);
  };

  goNext = (e?: React.SyntheticEvent) => {
    e && e.preventDefault();
    const { index, media } = this.state;
    const newState = { index: index + 1 };
    const isLastImage = index === media.length - 1;
    if (isLastImage) {
      newState.index = 0;
    }
    this.setState(newState);
  };

  deleteMedia = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.persist();
    }
    const changedMedia = this.state.media.filter((item, idx) => {
      return idx !== this.state.index;
    });

    this.setState({ media: changedMedia });
    this.props.deleteMedia(this.state.index, changedMedia);
    this.goNext();
  };

  updateMedia = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.persist();
    }
    // get the old values
    const { name, description } = this.props.media[this.state.index];
    const currentMedia = this.state.media[this.state.index];
    // compare with current state to see if there is a change.
    if (
      currentMedia.name !== name ||
      currentMedia.description !== description
    ) {
      this.setState({ saving: true });
      this.props.updateMedia(currentMedia, this.state.media);
    }
  };

  render() {
    const media = this.state.media[this.state.index];
    const { url, name, description } = media;
    const { t } = this.props;
    return (
      <StyledInfoModal>
        <ModalHoc onClose={this.props.onClose}>
          <div className="modal-body text-center">
            <div className="media-container">
              <div className="media-wrapper">
                {this.state.saving && <Loader />}
                <img src={url} />
                <div className="navigation">
                  <Button compact onClick={this.goPrevious}>
                    <i className="fa fa-chevron-left"></i>
                  </Button>{" "}
                  <Button compact onClick={this.goNext}>
                    <i className="fa fa-chevron-right"></i>
                  </Button>
                </div>
              </div>

              <div className="media-info">
                <StyledInput
                  label="Title"
                  value={name || ""}
                  placeholder="Give a name for this item"
                  name="name"
                  onChange={this.onChange}
                />
                <TextArea
                  label="Description"
                  value={description || ""}
                  name="description"
                  placeholder="Write a short description about this item"
                  rows={3}
                  onChange={this.onChange}
                />
                <div>
                  <br />
                  <Button btnStyle="danger" onClick={this.deleteMedia}>
                    {t("common.delete")}
                  </Button>
                  <Button btnStyle="primary" onClick={this.updateMedia}>
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalHoc>
      </StyledInfoModal>
    );
  }
}
export default translate("translations")(EditMediaInfo);
