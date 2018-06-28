import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MediaItem from "../../components/Media/MediaItem";
import EditMediaInfo from "../../components/Media/EditMediaInfo";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import GetMedia from "../../data-connectors/GetMedia";
import DeleteMedia from "../../data-connectors/DeleteMedia";
import InsertMedia from "../../data-connectors/InsertMedia";
import UpdateMedia from "../../data-connectors/UpdateMedia";
import config from "../../../config";
import { uploadFile } from "../../util";

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
        author: PropTypes.object
    };
    static defaultProps = {
        media: {
            rows: []
        }
    };
    static contextTypes = {
        t: PropTypes.func
    };
    constructor(props) {
        super(props);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteMediaFinal = this.deleteMediaFinal.bind(this);
        this.toggleMediaInfo = this.toggleMediaInfo.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.selectNextMedia = this.selectNextMedia.bind(this);
        this.selectPreviousMedia = this.selectPreviousMedia.bind(this);

        this.state = {
            page: 1,
            confirmDelete: false,
            delete_id: 0,
            deleteMedia: false,
            items: [],
            displayInfo: false,
            selectedItem: {},
            selectedIndex: 0
        };
        this.uploadInputRef = React.createRef();

        document.body.classList.add("media-page");
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = {
            items: [...nextProps.media.rows]
        };
        if (
            nextProps.match.params.page &&
            nextProps.match.params.page !== prevState.page
        ) {
            newState.page = parseInt(nextProps.match.params.page);
        }
        return newState;
    }

    componentWillUnmount() {
        document.body.classList.remove("media-page");
    }

    toggleDeleteModal(media = {}) {
        this.setState({
            confirmDelete: !this.state.confirmDelete,
            selectedItem: media
        });
    }

    deleteMediaFinal() {
        this.props.deleteMedia({
            id: this.state.selectedItem.id
        });
        this.toggleDeleteModal();
        this.setState({ deleteMedia: true });
    }

    toggleMediaInfo(selectedItem) {
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
            selectedIndex
        });
    }

    async uploadImage(files) {
        await uploadFile({ files, type: "post_image" });
        // if the user is in page 1, just refetch the items of page 1
        if (this.props.match.params.page == 1) {
            let items = await this.props.fetchMore({
                author_id: this.props.author.id,
                offset: 0,
                limit: config.mediaPerPage
            });
            this.setState({ items: items.data.media.rows });
        } else {
            // else navigate the user to page 1
            this.props.history.push("/admin/media/1");
        }
    }

    selectNextMedia() {
        const newState = {};
        if (this.state.selectedIndex === this.state.items.length - 1) {
            newState.selectedIndex = 0;
        } else {
            newState.selectedIndex = this.state.selectedIndex + 1;
        }
        newState.selectedItem = {
            ...this.state.items[newState.selectedIndex]
        };
        this.setState(newState);
    }

    selectPreviousMedia() {
        const newState = {};
        if (this.state.selectedIndex === 0) {
            newState.selectedIndex = this.state.items.length - 1;
        } else {
            newState.selectedIndex = this.state.selectedIndex - 1;
        }
        newState.selectedItem = {
            ...this.state.items[newState.selectedIndex]
        };
        this.setState(newState);
    }

    render() {
        const { t } = this.context;
        const items = this.state.items.map(media => (
            <MediaItem
                key={media.id}
                media={media}
                confirmDelete={this.toggleDeleteModal}
                editMediaInfo={this.toggleMediaInfo}
            />
        ));
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">{t("media.title")}</div>
                    <div className="module-subtitle">{t("media.tagline")}</div>
                    <p>
                        <button
                            className="btn btn-xs btn-dark"
                            onClick={() => {
                                this.uploadInputRef.current.click();
                            }}
                        >
                            Add Media
                        </button>
                        <input
                            ref={this.uploadInputRef}
                            onChange={input =>
                                this.uploadImage(input.target.files)
                            }
                            type="file"
                            className="hide"
                            name="uploads[]"
                            multiple="multiple"
                        />
                    </p>
                    <div className="media-grid">{items}</div>
                    <Paginate
                        count={this.props.media.count}
                        page={this.state.page}
                    />
                </div>
                {this.state.confirmDelete && (
                    <ConfirmDeleteModal
                        title="Confirm Delete"
                        text="Are you sure you want to delete this media ?"
                        onYes={this.deleteMediaFinal}
                        onClose={this.toggleDeleteModal}
                        media={this.state.selectedItem}
                        isOpen={this.state.confirmDelete}
                    />
                )}
                {this.state.displayInfo && (
                    <EditMediaInfo
                        media={this.state.selectedItem}
                        onClose={this.toggleMediaInfo}
                        isOpen={this.state.displayInfo}
                        updateMedia={this.props.updateMedia}
                        next={this.selectNextMedia}
                        previous={this.selectPreviousMedia}
                    />
                )}
            </section>
        );
    }
}

export default GetMedia(DeleteMedia(InsertMedia(UpdateMedia(Media))));

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
    page: PropTypes.number
};
