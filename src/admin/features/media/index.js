import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import moment from "moment";
import styled from "styled-components";
import { notify } from "react-notify-toast";

import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

import GetMedia from "../../data-connectors/GetMedia";
import DeleteMedia from "../../data-connectors/DeleteMedia";
import InsertMedia from "../../data-connectors/InsertMedia";
import UpdateMedia from "../../data-connectors/UpdateMedia";
import config from "../../../config";
import { uploadFile } from "../../server/util";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledButton from "../../components/button";

import InfoModal from "./InfoModal";

const EditMediaWrapper = styled.div`
  //take care of modal window si
  @media (max-width: 992px) {
    .open .modal-wrapper {
      height: 92vh;
    }
  }
`;

const StyledItem = styled.div`
  .selection-box {
    position: relative;
    z-index: 99;
    left: 100%;
    margin-left: -24px;
    border-top-right-radius: 7px;
    top: 4px;
  }
  [type="checkbox"]:checked,
  [type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="checkbox"]:checked + label,
  [type="checkbox"]:not(:checked) + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
  }
  [type="checkbox"]:checked + label:before,
  [type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0px;
    width: 18px;
    height: 18px;
    border: 1px solid #fff;
    background: #fff;
    box-shadow: 0px 0px 4px 1px #0000005c;
    border-radius: 50%;
  }
  [type="checkbox"]:checked + label:after,
  [type="checkbox"]:not(:checked) + label:after {
    content: "";
    width: 10px;
    height: 10px;
    background: #00a69c;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 5px;
    transition: all 0.1s ease;
  }
  [type="checkbox"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type="checkbox"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const limit = config.mediaPerPage;

class Media extends Component {
  static propTypes = {
    media: PropTypes.object,
    history: PropTypes.object,
    loading: PropTypes.bool,
    deleteMedia: PropTypes.func,
    insertMedia: PropTypes.func,
    match: PropTypes.object,
    fetchMore: PropTypes.func,
    updateMedia: PropTypes.func,
    author: PropTypes.object,
    t: PropTypes.func,
  };

  static defaultProps = {
    media: {
      rows: [],
    },
  };

  state = {
    page: 1,
    confirmDelete: false,
    delete_id: 0,
    deleteMedia: false,
    items: [],
    displayInfo: false,
    selectedItem: {},
    checkedItems: [],
    selectedIndex: 0,
  };

  uploadInputRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      items: [...nextProps.media.rows],
    };
    if (
      nextProps.match.params.page &&
      nextProps.match.params.page !== prevState.page
    ) {
      newState.page = parseInt(nextProps.match.params.page);
    }
    return newState;
  }

  componentDidMount() {
    document.body.classList.add("media-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("media-page");
  }

  toggleDeleteModal = () => {
    this.setState({
      confirmDelete: !this.state.confirmDelete,
    });
  };

  deleteSelectedMedia = async () => {
    await this.props.deleteMedia(this.state.checkedItems);
    this.setState({
      confirmDelete: false,
      checkedItems: [],
    });
  };

  editMedia = (e, media) => {
    e.preventDefault();
    this.toggleMediaInfo(media);
  };

  toggleMediaInfo = selectedItem => {
    let selectedIndex = this.state.selectedIndex;
    if (selectedItem) {
      // find the index of this item.
      this.state.items.forEach((item, i) => {
        if (selectedItem.id == item.id) {
          selectedIndex = i;
        }
      });
    }

    this.setState({
      displayInfo: !this.state.displayInfo,
      selectedItem,
      selectedIndex,
    });
  };

  uploadImage = async files => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    const errors = uploadedFiles.filter(file => file.errors);
    if (errors.length > 0) {
      notify.show(
        `${errors.length} out of ${uploadedFiles.length} had problems in image optimization`,
        "error",
        3000,
      );
      return;
    }
    // if the user is in page 1, just refetch the items of page 1
    if (this.props.match.params.page == 1) {
      let items = await this.props.fetchMore({
        authorId: this.props.author.id,
        offset: 0,
        limit: config.mediaPerPage,
      });
      this.setState({ items: items.data.media.rows });
    } else {
      // else navigate the user to page 1
      this.props.history.push("/admin/media/1");
    }
  };

  selectNextMedia = () => {
    const newState = {};
    if (this.state.selectedIndex === this.state.items.length - 1) {
      newState.selectedIndex = 0;
    } else {
      newState.selectedIndex = this.state.selectedIndex + 1;
    }
    newState.selectedItem = {
      ...this.state.items[newState.selectedIndex],
    };
    this.setState(newState);
  };

  selectPreviousMedia = () => {
    const newState = {};
    if (this.state.selectedIndex === 0) {
      newState.selectedIndex = this.state.items.length - 1;
    } else {
      newState.selectedIndex = this.state.selectedIndex - 1;
    }
    newState.selectedItem = {
      ...this.state.items[newState.selectedIndex],
    };
    this.setState(newState);
  };

  setSelection = (e, id) => {
    const checkedItems = [...this.state.checkedItems];
    const idx = checkedItems.indexOf(id);
    if (idx == -1) {
      checkedItems.push(id);
    } else {
      checkedItems.splice(idx, 1);
    }
    this.setState({ checkedItems });
  };

  render() {
    const { t } = this.props;
    const deleteCount = this.state.checkedItems.length;

    return (
      <StyledSection md title={t("media.title")} subtitle={t("media.tagline")}>
        <StyledButton
          success
          onClick={() => {
            this.uploadInputRef.current.click();
          }}
          sm
        >
          Add Media
        </StyledButton>
        {this.state.checkedItems.length > 0 && (
          <StyledButton danger sm onClick={this.toggleDeleteModal}>
            Delete
          </StyledButton>
        )}
        <input
          ref={this.uploadInputRef}
          onChange={input => this.uploadImage(input.target.files)}
          type="file"
          className="hide"
          name="uploads[]"
          multiple="multiple"
        />
        <br />
        <br />
        <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
          {this.state.items.map(media => (
            <StyledItem key={media.id}>
              <div className="selection-box">
                <input
                  type="checkbox"
                  id={"checkbox-" + media.id}
                  onClick={e => this.setSelection(e, media.id)}
                />
                <label htmlFor={"checkbox-" + media.id} />
              </div>
              <StyledGridItem
                image={config.baseName + media.url}
                title={media.name}
                href="#"
                line2={moment(media.createdAt).format("MMM Do YYYY")}
                onClick={e => this.editMedia(e, media)}
              />
            </StyledItem>
          ))}
        </StyledGrid>
        <Paginate count={this.props.media.count} page={this.state.page} />

        {this.state.confirmDelete && (
          <ConfirmDeleteModal
            title="Confirm Delete"
            text={`Are you sure you want to delete ${deleteCount} item${
              deleteCount == 1 ? "" : "s"
            }?`}
            onYes={this.deleteSelectedMedia}
            onClose={this.toggleDeleteModal}
            media={this.state.selectedItem}
            isOpen={this.state.confirmDelete}
          />
        )}
        {this.state.displayInfo && (
          <EditMediaWrapper>
            <InfoModal
              media={this.state.selectedItem}
              onClose={this.toggleMediaInfo}
              isOpen={this.state.displayInfo}
              updateMedia={this.props.updateMedia}
              next={this.selectNextMedia}
              previous={this.selectPreviousMedia}
            />
          </EditMediaWrapper>
        )}
      </StyledSection>
    );
  }
}

export default translate("translations")(
  GetMedia(DeleteMedia(InsertMedia(UpdateMedia(Media)))),
);

const Paginate = ({ count, page }) => {
  count = count || 0;

  if (count <= limit) return <span />;
  const pages = Array.from(Array(Math.ceil(count / limit)));
  return (
    <ul className="pagination">
      {pages.map((_, i) => {
        const num = i + 1;
        return (
          <li key={num} className={page == num ? "active" : ""}>
            <Link to={"/admin/media/" + num}>{num}</Link>
          </li>
        );
      })}
    </ul>
  );
};

Paginate.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
};
