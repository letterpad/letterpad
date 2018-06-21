import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MediaItem from "../../components/Media/MediaItem";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import GetMedia from "../../data-connectors/GetMedia";
import DeleteMedia from "../../data-connectors/DeleteMedia";
import InsertMedia from "../../data-connectors/InsertMedia";
import config from "config";
import { uploadFile } from "../../util";

const limit = config.itemsPerPage;

class Media extends Component {
    static propTypes = {
        media: PropTypes.object,
        history: PropTypes.object,
        loading: PropTypes.bool,
        deleteMedia: PropTypes.func,
        insertMedia: PropTypes.func,
        match: PropTypes.object
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
        this.toggleModal = this.toggleModal.bind(this);
        this.deleteMediaFinal = this.deleteMediaFinal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.state = {
            page: 1,
            confirmDelete: false,
            delete_id: 0,
            deleteMedia: false,
            items: []
        };
        this.uploadInputRef = React.createRef();

        document.body.classList.add("media-page");
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.items.length == nextProps.media.rows.length) {
            return null;
        }
        const newState = {
            items: nextProps.media.rows
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

    toggleModal(media = {}) {
        this.setState({
            confirmDelete: !this.state.confirmDelete,
            tempMedia: media
        });
    }

    deleteMediaFinal() {
        this.props.deleteMedia({
            id: this.state.tempMedia.id
        });
        this.toggleModal();
        this.setState({ deleteMedia: true });
    }

    async uploadImage(files) {
        const coverImage = await uploadFile({ files, type: "post_image" });
        const media = await this.props.insertMedia({
            url: coverImage
        });
        if (this.props.match.params.page == 1) {
            let items = await this.props.fetchMore({
                author_id: this.props.author.id,
                offset: 0,
                limit: 6
            });
            this.setState({ items: items.data.media.rows });
        } else {
            this.props.history.push("/admin/media/1");
        }
        // this.setState(
        //     {
        //         items: [media.data.insertMedia]
        //     },
        //     () => {
        //         this.props.history.push("/admin/media/1");
        //     }
        // );
    }

    render() {
        const { t } = this.context;
        const items = this.state.items.map((media, i) => (
            <MediaItem
                key={media.id}
                media={media}
                confirmDelete={this.toggleModal}
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
                        onClose={this.toggleModal}
                        media={this.state.tempMedia}
                        isOpen={this.state.confirmDelete}
                    />
                )}
            </section>
        );
    }
}

export default GetMedia(DeleteMedia(InsertMedia(Media)));

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
