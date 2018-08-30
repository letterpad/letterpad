import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";
import styled from "styled-components";

import GetTaxonomies from "../../data-connectors/GetTaxonomies";
import UpdateTaxonomy from "../../data-connectors/UpdateTaxonomy";
import DeleteTaxonomy from "../../data-connectors/DeleteTaxonomy";
import Taxonomies from "./Taxonomies";
import StyledTaxonomy from "./Taxonomy.css";

import StyledSection from "../../components/section";
import StyledInput from "../../components/input";
import StyledGrid from "../../components/grid";
import StyledButton from "../../components/button";

const NewTagWrapper = styled.div`
    display: flex;
    border-top: none;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--color-border);
    padding: 0 12px;
    .input-box {
        margin-bottom: 0px;
        input {
            border: none;
            flex: 1;
        }
    }
`;

const Icon = styled.i`
    color: #1a82d6;
    margin-right: 0.5rem;
    font-size: 20px;
    cursor: pointer;
`;

class Taxonomy extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        updateTaxonomy: PropTypes.func.isRequired,
        deleteTaxonomy: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        networkStatus: PropTypes.number.isRequired,
        taxonomies: PropTypes.Array,
        size: PropTypes.object,
        t: PropTypes.func
    };

    constructor(props) {
        super(props);
        const { t } = this.props;
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
        this.state = {
            taxonomies: [],
            newTagName: "",
            selectedIndex: 0,
            TaxonomyClicked: false
        };
    }

    componentDidMount() {
        document.body.classList.add("taxonomy-" + this.props.type + "-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("taxonomy-" + this.props.type + "-page");
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            !nextProps.loading &&
            prevState.taxonomies.length === 0 &&
            nextProps.taxonomies.length > 0
        ) {
            return {
                taxonomies: [...nextProps.taxonomies]
            };
        }
        return null;
    }

    editSaveTaxonomy = async id => {
        const { taxonomies, selectedIndex } = this.state;
        const { type, updateTaxonomy } = this.props;
        const item = { ...taxonomies.filter(t => t.id === id)[0], type };

        // merge new changes into this item
        const changedItem = { ...item, ...taxonomies[selectedIndex], edit: 1 };

        const result = await updateTaxonomy(changedItem);
        if (result.data.updateTaxonomy.ok) {
            notify.show("Taxonomy Saved", "success", 3000);
        } else {
            notify.show(
                result.data.updateTaxonomy.errors[0].message,
                "error",
                3000
            );
        }
    };

    handleNewTagName = e => {
        this.setState({ newTagName: e.target.value });
    };

    saveNewTag = async () => {
        const { newTagName, taxonomies } = this.state;
        const { type, updateTaxonomy } = this.props;

        if (!newTagName) {
            return;
        }

        let item = {
            type,
            name: newTagName,
            desc: "",
            edit: 0,
            id: 0,
            slug: newTagName
        };

        const result = await updateTaxonomy(item);

        if (result.data.updateTaxonomy.ok) {
            let id = result.data.updateTaxonomy.id;
            item.id = id;
            const newState = [...taxonomies, { ...item }];
            this.setState({
                taxonomies: newState,
                selectedIndex: newState.length - 1,
                newTagName: ""
            });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        const taxonomies = this.state.taxonomies.map((item, index) => {
            if (index === this.state.selectedIndex) {
                item[name] = value;
            }
            return item;
        });
        this.setState({ taxonomies });
    };

    handleSelect = index => {
        this.setState({ selectedIndex: index });
    };

    handleTaxonomyClick = () => {
        this.setState(s => ({ TaxonomyClicked: !s.TaxonomyClicked }));
    };

    deleteTax = () => {
        let { selectedIndex } = this.state;
        const { id } = this.state.taxonomies[selectedIndex];
        const taxonomies = [...this.state.taxonomies];
        taxonomies.splice(selectedIndex, 1);

        let newIndex = selectedIndex;
        if (taxonomies.length - 1 < newIndex) {
            newIndex = 0;
        }
        this.setState(
            {
                taxonomies,
                selectedIndex: newIndex
            },
            () => {
                this.props.deleteTaxonomy({ id });
            }
        );
    };

    render() {
        const { t } = this.props;
        const {
            taxonomies,
            newTagName,
            TaxonomyClicked,
            selectedIndex
        } = this.state;
        const { loading, networkStatus } = this.props;
        const isLoading = loading || !networkStatus === 2;
        if (isLoading) return null;

        let slug, desc, id, name;

        if (taxonomies.length > 0) {
            slug = taxonomies[selectedIndex].slug;
            desc = taxonomies[selectedIndex].desc;
            id = taxonomies[selectedIndex].id;
            name = taxonomies[selectedIndex].name;
        }
        const isMobile = true;
        const open = isMobile ? (TaxonomyClicked ? true : false) : true;
        return (
            <StyledSection
                title={this.defaultText.title1}
                subtitle={this.defaultText.subtitle1}
            >
                <StyledTaxonomy>
                    <StyledGrid columns="repeat(2, minmax(300px,1fr))">
                        <div className="taxonomy-list">
                            <Taxonomies
                                numRows={taxonomies.length}
                                rowHeight={44}
                                items={taxonomies || []}
                                selectedIndex={selectedIndex}
                                handleSelect={this.handleSelect}
                                handleTaxonomyClick={this.handleTaxonomyClick}
                                isMobile={isMobile}
                                open={open}
                                TaxonomyClicked={TaxonomyClicked}
                            />

                            <NewTagWrapper>
                                <StyledInput
                                    value={newTagName}
                                    onChange={this.handleNewTagName}
                                    placeholder="Add a new tag..."
                                    onKeyDown={e =>
                                        e.keyCode == 13 && this.saveNewTag()
                                    }
                                />
                                <Icon
                                    className="fa fa-plus"
                                    onClick={this.saveNewTag}
                                />
                            </NewTagWrapper>
                        </div>
                        <div className="taxonomy-edit">
                            <StyledInput
                                label={t("common.name")}
                                type="text"
                                value={name}
                                onChange={this.handleChange}
                                name="name"
                            />
                            <StyledInput
                                label={t("common.slug")}
                                type="text"
                                placeholder="Enter your blog's title"
                                value={slug ? slug : ""}
                                onChange={this.handleChange}
                                name="slug"
                            />
                            <StyledInput
                                label={t("common.description")}
                                rows="2"
                                textarea
                                placeholder={`Enter a short description about the ${slug} tag. This maybe used by some themes`}
                                name="desc"
                                onChange={this.handleChange}
                                value={desc ? desc : ""}
                            />
                            <div>
                                <StyledButton
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.deleteTax();
                                    }}
                                >
                                    Delete tag
                                </StyledButton>
                                <StyledButton
                                    success
                                    onClick={() => this.editSaveTaxonomy(id)}
                                >
                                    Save
                                </StyledButton>
                            </div>
                        </div>
                    </StyledGrid>
                </StyledTaxonomy>
            </StyledSection>
        );
    }
}

export default translate("translations")(
    DeleteTaxonomy(UpdateTaxonomy(GetTaxonomies(Taxonomy)))
);
