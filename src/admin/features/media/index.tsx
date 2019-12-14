import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
// import PropTypes from "prop-types";
import { translate, WithNamespaces } from "react-i18next";
import moment from "moment";
import { notify } from "react-notify-toast";

import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

// import GetMedia from "../../data-connectors/GetMedia";
// import DeleteMedia from "../../data-connectors/DeleteMedia";
// import InsertMedia from "../../data-connectors/InsertMedia";
// import UpdateMedia from "../../data-connectors/UpdateMedia";
import config from "../../../config";
import { uploadFile } from "../../server/util";

import StyledSection from "../../components/section";
import StyledGrid from "../../components/grid";
import StyledGridItem from "../../components/grid/GridItem";
import StyledButton from "../../components/button";

// import InfoModal from "./InfoModal";
import { StyledItem } from "./Media.css";
import { deleteMedias, getMedia } from "./actions";
import { media_media_rows } from "../../../shared/queries/types/media";

const limit = config.mediaPerPage;

interface IMMediaProps extends WithNamespaces {
  router: RouteComponentProps;
}

interface IMediaState {
  page: number;
  confirmDelete: boolean;
  delete_id: number;
  deleteMedia: boolean;
  items: {
    count: number;
    rows: media_media_rows[];
  };
  displayInfo: boolean;
  checkedItems: number[];
  selectedIndex: number;
  loading: boolean;
}

class Media extends Component<IMMediaProps, IMediaState> {
  state: Readonly<IMediaState> = {
    page: 1,
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

  async componentDidMount() {
    const { data, loading } = await getMedia();
    this.setState({
      loading: loading,
      items: {
        rows: data.media.rows,
        count: data.media.count,
      },
    });
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
    const page = this.props.router.match.params["page"];
    // if the user is in page 1, just refetch the items of page 1
    if (page == 1) {
      // let items = await this.props.fetchMore({
      //   authorId: this.props.author.id,
      //   offset: 0,
      //   limit: config.mediaPerPage,
      // });
      // this.setState({ items: items.data.media.rows });
    } else {
      // else navigate the user to page 1
      this.props.router.history.push("/admin/media/1");
    }
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

  render() {
    const { t } = this.props;
    const { checkedItems, page, items } = this.state;
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
                title={media.name}
                href="#"
                line2={moment(media.createdAt).format("MMM Do YYYY")}
                onClick={(e: React.SyntheticEvent) => this.editMedia(e, idx)}
              />
            </StyledItem>
          ))}
        </StyledGrid>
        <Paginate count={items.count} page={page} />
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
