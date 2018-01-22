import React, { Component } from "react";
import { graphql } from "react-apollo";
import moment from "moment";
import PropTypes from "prop-types";
import { Item } from "../components/posts/TableRow";
import { GET_POSTS, GET_TAXONOMIES } from "../../shared/queries/Queries";
import PostsHoc from "./hoc/PostsHoc";
import Paginate from "../components/Paginate";
import { PostFilters } from "../components/posts/Filter";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import TextField from "material-ui/TextField";

import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "material-ui/Table";
import Card, { CardActions, CardHeader, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import {
    UPDATE_TAXONOMY,
    DELETE_TAXONOMY
} from "../../shared/queries/Mutations";
import PageHeader from "../components/PageHeader";
import Paper from "material-ui/Paper/Paper";

class Taxonomy extends Component {
    constructor(props) {
        super(props);
        this.editSaveTaxonomy = this.editSaveTaxonomy.bind(this);
        this.newTaxClicked = this.newTaxClicked.bind(this);
        this.deleteTax = this.deleteTax.bind(this);
        this.texts = {
            post_tag: {
                title1: "Manage Tags",
                subtitle1:
                    "You can edit all your tags from here. Posts linked with those tags will automatically get updated.",
                title2: "Create a tag",
                input1: "Name of the tag",
                input2: "Description of the tag"
            },
            post_category: {
                title1: "Manage Categories",
                subtitle1:
                    "You can edit all your categories from here. Posts linked with those categories will automatically get updated.",
                title2: "Create a category",
                input1: "Name of the category",
                input2: "Description of the category"
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
            this.state.taxonomies = nextProps.taxonomies;
            this.state.filteredData = nextProps.taxonomies;
            this.setState(this.state);
        }
    }
    setRef(ele, idx, key) {
        if (!this.refList[idx]) {
            this.refList[idx] = {};
        }
        this.refList[idx][key] = ele;
    }

    editSaveTaxonomy(idx) {
        let item = this.state.filteredData[idx];

        if (typeof item.edit === "undefined") {
            item.edit = false;
        }
        if (this.state.editMode && !item.edit) {
            return;
        }
        if (item.edit && item.name == "") {
            return alert("Cannot be empty");
        }

        item.edit = !item.edit;

        this.state.editMode = item.edit;

        this.state.filteredData[idx] = item;

        this.setState(this.state, async () => {
            if (item.edit) {
                this.refList[idx].name.focus();
            } else {
                item.type = this.props.type;
                const result = await this.props.updateTaxonomy(item);
                if (result.data.updateTaxonomy.ok) {
                    this.state.filteredData[idx].id =
                        result.data.updateTaxonomy.id;
                    this.setState(this.state);
                }
            }
        });
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
        const loading = this.props.loading || !this.props.networkStatus === 2;
        if (loading) return null;
        const style = {
            tableBtns: {
                marginRight: 5,
                cursor: "pointer"
            }
        };
        const rows = this.state.filteredData.map((item, idx) => (
            <TableRow
                selectable={false}
                className={item.edit ? "row-selected" : ""}
            >
                <TableCell width="30%">
                    <span
                        ref={ele => this.setRef(ele, idx, "name")}
                        onKeyUp={e =>
                            this.handleChange(
                                idx,
                                "name",
                                e.currentTarget.innerHTML
                            )
                        }
                        className={item.edit ? "inline-edit" : ""}
                        placeholder={this.defaultText.input1}
                        contentEditable={item.edit}
                    >
                        {item.name}
                    </span>
                </TableCell>
                <TableCell width="50%">
                    <span
                        ref={ele => this.setRef(ele, idx, "desc")}
                        onKeyUp={e =>
                            this.handleChange(
                                idx,
                                "desc",
                                e.currentTarget.innerHTML
                            )
                        }
                        className={item.edit ? "inline-edit" : ""}
                        placeholder={this.defaultText.input2}
                        contentEditable={item.edit}
                    >
                        {item.desc || ""}
                    </span>
                </TableCell>
                <TableCell width="20%">
                    <i
                        onClick={() => this.editSaveTaxonomy(idx, item.edit)}
                        style={style.tableBtns}
                        className="material-icons"
                    >
                        {item.edit ? "save" : "edit"}
                    </i>

                    <i
                        onClick={() => this.deleteTax(idx)}
                        style={style.tableBtns}
                        className="material-icons"
                    >
                        delete
                    </i>
                </TableCell>
            </TableRow>
        ));

        return (
            <div className="row">
                <PageHeader
                    title={this.defaultText.title1}
                    subtitle={this.defaultText.subtitle1}
                />
                <CardContent>
                    <div>
                        <IconButton
                            aria-label="Add"
                            onClick={this.newTaxClicked}
                        >
                            <i className="material-icons">add</i>
                        </IconButton>
                    </div>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody deselectOnClickaway={false}>
                                {rows}
                            </TableBody>
                        </Table>
                    </Paper>
                </CardContent>
            </div>
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
export default deleteTaxonomyQuery(
    updateTaxonomyQuery(ContainerWithData(Taxonomy))
);
