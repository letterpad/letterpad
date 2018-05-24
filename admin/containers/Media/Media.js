import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MediaItem from "../../components/Media/MediaItem";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import GetMedia from "../../data-connectors/GetMedia";
import DeleteMedia from "../../data-connectors/DeleteMedia";
import config from "config";

const limit = config.itemsPerPage;

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

class Media extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.deleteMediaFinal = this.deleteMediaFinal.bind(this);
        this.state = {
            page: 1,
            confirmDelete: false,
            delete_id: 0,
            deleteMedia: false
        };
        document.body.classList.add("media-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("media-page");
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.match.params.page &&
            nextProps.match.params.page !== this.state.page
        ) {
            this.setState({ page: parseInt(nextProps.match.params.page) });
        }
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

    render() {
        const rows = this.props.media.rows.map((media, i) => (
            <MediaItem
                key={media.id}
                media={media}
                confirmDelete={this.toggleModal}
            />
        ));
        const { t } = this.context;
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">{t("media.title")}</div>
                    <div className="module-subtitle">{t("media.tagline")}</div>
                    <div className="row media-grid">{rows}</div>
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

Media.propTypes = {
    media: PropTypes.object,
    loading: PropTypes.bool,
    deleteMedia: PropTypes.func,
    match: PropTypes.object
};
Media.defaultProps = {
    media: {
        rows: []
    }
};
Media.contextTypes = {
    t: PropTypes.func
};
export default GetMedia(DeleteMedia(Media));
