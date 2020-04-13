import { EditMediaWrapper, Grid, StyledItem } from "./Media.css";
import React, { Component } from "react";
import StyledSection, { SectionSizes } from "../../components/section";
import { WithNamespaces, translate } from "react-i18next";
import { deleteMedias, getMedia, updateMedia } from "./actions";

import { Button } from "../../components/button";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import EditMediaInfo from "./EditMediaInfo";
import { MediaNode } from "../../../__generated__/gqlTypes";
import Paginate from "../../components/pagination";
import Portal from "../portal";
import { RouteComponentProps } from "react-router-dom";
import StyledGridItem from "../../components/grid/GridItem";
import { notify } from "react-notify-toast";
import { uploadFile } from "../../server/util";

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

  goToNextPage = (e: React.SyntheticEvent, page: number) => {
    e.preventDefault();
    this.props.router.history.push({
      search: "?page=" + page,
    });
    this.fetchMedia();
  };

  render() {
    const { t } = this.props;
    const { items, displayInfo, selectedIndex } = this.state;

    return (
      <StyledSection
        size={SectionSizes.md}
        rightToolbar={
          <Actions
            newMediaAction={() => {
              if (this.uploadInputRef.current) {
                this.uploadInputRef.current.click();
              }
            }}
          />
        }
        title={t("media.title")}
      >
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
        <Grid>
          {items.rows.map((media, idx) => (
            <StyledItem key={media.id}>
              <StyledGridItem
                image={{
                  src: media.url,
                  width: media.width,
                  height: media.height,
                }}
                title={media.name || ""}
                href="#"
                onClick={(e: React.SyntheticEvent) => this.editMedia(e, idx)}
              />
            </StyledItem>
          ))}
        </Grid>
        <Paginate
          count={items.count}
          page={parseInt(this.getUrlParams().get("page") || "1")}
          changePage={this.goToNextPage}
          limit={itemsPerPage}
        />
        {/* {this.state.confirmDelete && (
          <ConfirmDeleteModal
            title="Confirm Delete"
            text={`Are you sure you want to delete this media`}
            onYes={this.deleteSelectedMedia}
            onClose={this.toggleDeleteModal}
          />
        )} */}
        {displayInfo && (
          <Portal>
            <EditMediaWrapper>
              <EditMediaInfo
                media={items.rows}
                index={selectedIndex}
                onClose={() => this.setState({ displayInfo: false })}
                deleteMedia={(id, rows) => {
                  this.setState({ items: { ...this.state.items, rows } });
                  deleteMedias([id]);
                }}
                updateMedia={(change, rows) => {
                  this.setState({ items: { ...this.state.items, rows } });
                  updateMedia(change);
                }}
              />
            </EditMediaWrapper>
          </Portal>
        )}
      </StyledSection>
    );
  }
}

export default translate("translations")(Media);

const Actions = ({ newMediaAction }) => {
  return (
    <>
      <Button btnSize="md" btnStyle="primary" onClick={newMediaAction}>
        Add Media
      </Button>
    </>
  );
};
