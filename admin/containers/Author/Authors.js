import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GetAuthors } from "../../data-connectors/GetAuthors";
import Loader from "../../components/Loader";
import AuthorRow from "./AuthorRow";

class Authors extends Component {
    static propTypes = {
        history: PropTypes.object,
        authors: PropTypes.array,
        loading: PropTypes.bool
    };
    static contextTypes = {
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.authorSelect = this.authorSelect.bind(this);
        document.body.classList.add("authors-page");
    }
    componentWillUnmount() {
        document.body.classList.remove("authors-page");
    }

    authorSelect(id) {
        this.props.history.push("/admin/authors/edit/" + id);
    }
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        const { t } = this.context;
        const rows = this.props.authors.map((author, i) => (
            <AuthorRow
                handleClick={this.authorSelect}
                key={i}
                author={author}
            />
        ));

        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">{t("authors.title")}</div>
                    <div className="module-subtitle">
                        {t("authors.tagline")}
                    </div>
                    <div className="m-b-20">
                        <Link
                            className="btn btn-xs btn-dark"
                            aria-label="Add"
                            to="/admin/authors/new"
                        >
                            <i className="fa fa-plus" /> Create
                        </Link>
                    </div>
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="20%" className="col-text">
                                    Email
                                </th>
                                <th width="10%" className="col-text">
                                    Name
                                </th>
                                <th width="10%" className="col-text">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            </section>
        );
    }
}

export default GetAuthors(Authors);
