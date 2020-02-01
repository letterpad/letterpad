import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { translate, WithNamespaces } from "react-i18next";
import moment from "moment";
import { notify } from "react-notify-toast";
import Paginate from "../../components/pagination";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import config from "../../../config";
import { uploadFile } from "../../server/util";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledButton from "../../components/button";

// import InfoModal from "./InfoModal";
import { StyledItem } from "./Media.css";
import { deleteMedias, getMedia } from "./actions";
import { MediaNode } from "../../../__generated__/gqlTypes";

const itemsPerPage = 12;

interface IMMediaProps extends WithNamespaces {
  router: RouteComponentProps;
}

interface IMediaState {
  confirmDelete: boolean;
  delete_id: number;
  deleteMedia: boolean;
  items: {
    count: number;
    rows: MediaNode["rows"];
  };
  displayInfo: boolean;
  checkedItems: number[];
  selectedIndex: number;
  loading: boolean;
}

class Media extends Component<IMMediaProps, IMediaState> {
  state: Readonly<IMediaState> = {
    confirmDelete: false,
    delete_id: 0,
    deleteMedia: false,
    items: {
      rows: [],
      count: 0,
    },
    displayInfo: false,
    // selectedItem: {},
    checkedItems: [],
    selectedIndex: 0,
    loading: true,
  };

  uploadInputRef = React.createRef<HTMLInputElement>();

  fetchMedia = async () => {
    const params = this.getUrlParams();
    const page = parseInt(params.get("page") || "1");
    const { data, loading } = await getMedia({
      page,
      limit: itemsPerPage,
    });
    this.setState({
      loading: loading,
      items: {
        rows: data.media.rows,
        count: data.media.count,
      },
    });
  };

  async componentDidMount() {
    await this.fetchMedia();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      ...prevState,
      // items: { ...nextProps.media },
    };
    const { page } = nextProps.router.match.params;
    if (page && page !== prevState.page) {
      newState.page = parseInt(page);
    }
    return newState;
  }

  getUrlParams = () => {
    return new URLSearchParams(this.props.router.history.location.search);
  };

  toggleDeleteModal = () => {
    this.setState({
      confirmDelete: !this.state.confirmDelete,
    });
  };

  deleteSelectedMedia = async () => {
    if (this.state.checkedItems.length > 0) {
      await deleteMedias(this.state.checkedItems);
      this.setState({
        confirmDelete: false,
        checkedItems: [],
      });
    }
  };

  editMedia = (e: React.SyntheticEvent, idx: number) => {
    e.preventDefault();
    this.toggleMediaInfo(idx);
  };

  toggleMediaInfo = (idx: number) => {
    this.setState({ selectedIndex: idx, displayInfo: true });
  };

  uploadImage = async (files: FileList) => {
    const uploadedFiles = await uploadFile({ files, type: "post_image" });
    const errors = uploadedFiles.filter((file: any) => file.errors);
    if (errors.length > 0) {
      notify.show(
        `${errors.length} out of ${uploadedFiles.length} had problems in image optimization`,
        "error",
        3000,
      );
      return;
    }
    this.props.router.history.push({
      search: "?page=1",
    });
    this.fetchMedia();
  };

  selectNextMedia = () => {
    const { selectedIndex, items } = this.state;
    const newState = { selectedIndex: selectedIndex + 1 };
    const isLastImage = selectedIndex === items.rows.length - 1;
    if (isLastImage) {
      newState.selectedIndex = 0;
    }
    this.setState(newState);
  };

  selectPreviousMedia = () => {
    const { selectedIndex, items } = this.state;
    const newState = { selectedIndex: selectedIndex - 1 };
    const isFirstImage = selectedIndex === 0;
    if (isFirstImage) {
      newState.selectedIndex = items.rows.length - 1;
    }
    this.setState(newState);
  };

  onMediaCheckBoxClick = (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    let checkedItems = [...this.state.checkedItems];

    if (checkedItems.includes(id)) {
      checkedItems = checkedItems.filter(checkedIds => checkedIds !== id);
    } else {
      checkedItems.push(id);
    }
    this.setState({ checkedItems });
  };

  goToNextPage = (e: React.SyntheticEvent, page: number) => {
    e.preventDefault();
    this.props.router.history.push({
      search: "?page=" + page,
    });
    this.fetchMedia();
  };

  render() {
    const { t } = this.props;
    const { checkedItems, items } = this.state;
    const deleteCount = checkedItems.length;

    return (
      <StyledSection md title={t("media.title")} subtitle={t("media.tagline")}>
        <StyledButton
          success
          onClick={() => {
            if (this.uploadInputRef.current) {
              this.uploadInputRef.current.click();
            }
          }}
          sm
        >
          Add Media
        </StyledButton>
        {checkedItems.length > 0 && (
          <StyledButton danger sm onClick={this.toggleDeleteModal}>
            Delete
          </StyledButton>
        )}
        <input
          ref={this.uploadInputRef}
          onChange={input =>
            input.target.files && this.uploadImage(input.target.files)
          }
          type="file"
          className="hide"
          name="uploads[]"
          multiple={true}
        />
        <br />
        <br />
        <StyledGrid columns="repeat(auto-fit,minmax(200px,1fr))">
          {items.rows.map((media, idx) => (
            <StyledItem key={media.id}>
              <div className="selection-box">
                <input
                  type="checkbox"
                  id={"checkbox-" + media.id}
                  checked={checkedItems.includes(media.id)}
                  onClick={e => this.onMediaCheckBoxClick(e, media.id)}
                />
                <label htmlFor={"checkbox-" + media.id} />
              </div>
              <StyledGridItem
                image={config.baseName + media.url}
                title={media.name || ""}
                href="#"
                line2={moment(media.createdAt).format("MMM Do YYYY")}
                onClick={(e: React.SyntheticEvent) => this.editMedia(e, idx)}
              />
            </StyledItem>
          ))}
        </StyledGrid>
        <Paginate
          count={items.count}
          page={parseInt(this.getUrlParams().get("page") || "1")}
          changePage={this.goToNextPage}
          limit={itemsPerPage}
        />
        {this.state.confirmDelete && (
          <ConfirmDeleteModal
            title="Confirm Delete"
            text={`Are you sure you want to delete ${deleteCount} item${
              deleteCount == 1 ? "" : "s"
            }?`}
            onYes={this.deleteSelectedMedia}
            onClose={this.toggleDeleteModal}
          />
        )}
        {/* {displayInfo && (
          <EditMediaWrapper>
            <InfoModal
              media={items.rows[selectedIndex]}
              onClose={() => this.setState({ displayInfo: false })}
              next={this.selectNextMedia}
              previous={this.selectPreviousMedia}
            />
          </EditMediaWrapper>
        )} */}
      </StyledSection>
    );
  }
}

export default translate("translations")(Media);
