import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import PostsHoc from "./PostsHoc";
import Paginate from "../../components/Paginate";
import { PostFilters } from "../../components/Post";
import Loader from "../../components/Loader";
import { GET_POSTS, GET_TAXONOMIES } from "../../../shared/queries/Queries";
import {
    UPDATE_TAXONOMY,
    DELETE_TAXONOMY
} from "../../../shared/queries/Mutations";

class Taxonomy extends Component {
    constructor(props, context) {
        super(props);
        this.editSaveTaxonomy = this.editSaveTaxonomy.bind(this);
        this.newTaxClicked = this.newTaxClicked.bind(this);
        this.deleteTax = this.deleteTax.bind(this);
        const { t } = context;
        this.texts = {
            post_tag: {
                title1: t("tags.title"),
                subtitle1: t("tags.tagline"),
                title2: t("tags.create"),
                input1: t("tags.create.name.placeholder"),
                input2: t("tags.create.desc.placeholder")
            },
            post_category: {
                title1: t("categories.title"),
                subtitle1: t("categories.tagline"),
                title2: t("categories.create"),
                input1: t("categories.create.name.placeholder"),
                input2: t("categories.create.desc.placeholder")
            }
        };
        this.defaultText = this.texts[this.props.type];
        this.refList = {};
        this.state = {
            taxonomies: [],
            filteredData: [],
            editMode: false
        };
    }
    componentWillReceiveProps(nextProps) {
        if (
            !nextProps.loading &&
            this.state.taxonomies.length !== nextProps.taxonomies.length
        ) {
            this.setState({
                taxonomies: [...nextProps.taxonomies],
                filteredData: [...nextProps.taxonomies]
            });
        }
    }
    setRef(ele, idx, key) {
        if (!this.refList[idx]) {
            this.refList[idx] = {};
        }
        this.refList[idx][key] = ele;
    }

    async editSaveTaxonomy(idx) {
        let item = { ...this.state.filteredData[idx] };
        let oldItem = this.state.taxonomies[idx];

        if (typeof item.edit === "undefined") {
            item.edit = false;
        }
        //  dont allow multiple edits
        if (this.state.editMode && !item.edit) {
            return false;
        }

        const newState = { editMode: !item.edit };
        newState.filteredData = [...this.state.filteredData];
        newState.filteredData[idx] = item;

        //  make the item editable
        if (!item.edit) {
            newState.filteredData[idx].edit = true;

            return this.setState(newState, _ => {
                this.refList[idx].name.focus();
            });
        } else if (
            item.name == oldItem.name &&
            item.desc == oldItem.desc &&
            item.slug == oldItem.slug &&
            item.edit
        ) {
            delete newState.filteredData[idx].edit;
            return this.setState(newState);
        }
        // dont allow empty taxonomies
        if (item.edit && item.name == "") {
            return alert("Cannot be empty");
        }
        if (!item.slug) {
            item.slug = item.name.toLowerCase().replace(/ /g, "-");
        }
        newState.editMode = false;
        item.type = this.props.type;
        const result = await this.props.updateTaxonomy(item);
        if (result.data.updateTaxonomy.ok) {
            newState.filteredData[idx].id = result.data.updateTaxonomy.id;
            delete newState.filteredData[idx].edit;
            this.setState(newState);
            notify.show("Taxonomy Saved", "success", 3000);
        } else {
            notify.show(
                result.data.updateTaxonomy.errors[0].message,
                "error",
                3000
            );
        }
    }

    newTaxClicked() {
        this.state.editMode = false;
        this.state.filteredData.unshift({
            id: 0,
            name: "",
            desc: "",
            edit: true
        });
        this.setState(this.state, () => {
            this.refList[0].name.focus();
        });
    }

    handleChange(idx, key, value, maxWidth = 20) {
        this.state.filteredData[idx][key] = value;
        this.setState(this.state);
    }
    deleteTax(idx) {
        let id = this.state.filteredData[idx].id;
        this.props.deleteTaxonomy({ id: id });
        delete this.state.filteredData[idx];
        this.setState(this.state);
    }
    render() {
        const { t } = this.context;
        const loading = this.props.loading || !this.props.networkStatus === 2;
        if (loading) return null;
        const style = {
            tableBtns: {
                marginRight: 5,
                cursor: "pointer"
            }
        };
        const rows = this.state.filteredData.map((item, idx) => (
            <tr key={idx} className={item.edit ? "row-selected" : ""}>
                <td width="25%">
                    <span
                        style={{ display: "block" }}
                        ref={ele => this.setRef(ele, idx, "name")}
                        onKeyUp={e =>
                            this.handleChange(
                                idx,
                                "name",
                                e.currentTarget.innerText
                            )
                        }
                        className={item.edit ? "inline-edit" : ""}
                        placeholder={this.defaultText.input1}
                        contentEditable={item.edit}
                    >
                        {item.name}
                    </span>
                </td>
                <td width="35%">
                    <span
                        style={{ display: "block" }}
                        ref={ele => this.setRef(ele, idx, "desc")}
                        onKeyUp={e =>
                            this.handleChange(
                                idx,
                                "desc",
                                e.currentTarget.innerText
                            )
                        }
                        className={item.edit ? "inline-edit" : ""}
                        placeholder={this.defaultText.input2}
                        contentEditable={item.edit}
                    >
                        {item.desc || ""}
                    </span>
                </td>
                <td width="20%">
                    <span
                        style={{ display: "block" }}
                        ref={ele => this.setRef(ele, idx, "slug")}
                        onKeyUp={e =>
                            this.handleChange(
                                idx,
                                "slug",
                                e.currentTarget.innerText
                            )
                        }
                        className={item.edit ? "inline-edit" : ""}
                        placeholder="Enter a slug"
                        contentEditable={item.edit}
                    >
                        {item.slug || ""}
                    </span>
                </td>
                <td width="20%">
                    <button
                        onClick={_ => this.editSaveTaxonomy(idx, item.edit)}
                        className={
                            "btn btn-xs btn-" + (item.edit ? "success" : "dark")
                        }
                    >
                        {item.edit ? t("common.save") : t("common.edit")}
                    </button>
                    &nbsp;&nbsp;
                    <button
                        onClick={_ => this.deleteTax(idx)}
                        className="btn btn-xs btn-danger btn-danger-invert"
                    >
                        {t("common.delete")}
                    </button>
                </td>
            </tr>
        ));

        return (
            <section className="module-xs fs-normal">
                <div className="card">
                    <div className="module-title">
                        {this.defaultText.title1}
                    </div>
                    <div className="module-subtitle">
                        {this.defaultText.subtitle1}
                    </div>

                    <div className="m-b-20">
                        <button
                            className="btn btn-xs btn-dark"
                            aria-label="Add"
                            onClick={this.newTaxClicked}
                        >
                            <i className="fa fa-plus" />
                        </button>
                    </div>
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="25%" className="col-text">
                                    {t("common.name")}
                                </th>
                                <th width="25%" className="col-text">
                                    {t("common.description")}
                                </th>
                                <th width="25%" className="col-text">
                                    {t("common.slug")}
                                </th>
                                <th width="25%" className="col-text">
                                    {t("common.actions")}
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

const ContainerWithData = graphql(GET_TAXONOMIES, {
    options: props => {
        return {
            variables: {
                type: props.type
            },
            forceFetch: true,
            fetchPolicy: "network-only"
        };
    },
    props: ({ data: { loading, taxonomies, networkStatus } }) => ({
        taxonomies,
        loading,
        networkStatus
    })
});

const updateTaxonomyQuery = graphql(UPDATE_TAXONOMY, {
    props: ({ mutate }) => ({
        updateTaxonomy: data =>
            mutate({
                variables: data
            })
    })
});

const deleteTaxonomyQuery = graphql(DELETE_TAXONOMY, {
    props: ({ mutate }) => ({
        deleteTaxonomy: data =>
            mutate({
                variables: data
            })
    })
});

Taxonomy.contextTypes = {
    t: PropTypes.func
};

export default deleteTaxonomyQuery(
    updateTaxonomyQuery(ContainerWithData(Taxonomy))
);
