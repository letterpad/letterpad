import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { translate } from "react-i18next";
import styled from "styled-components";

import GetTaxonomies from "../../data-connectors/GetTaxonomies";
import UpdateTaxonomy from "../../data-connectors/UpdateTaxonomy";
import DeleteTaxonomy from "../../data-connectors/DeleteTaxonomy";
import Taxonomies from "./Taxonomies";

const Wrapper = styled.div`
    width: 100%;
    height: 75%;
    display: flex;
    button {
        cursor: pointer;
    }
    @media (max-width: 767px) {
        flex-direction: column;
        height: 100%;
    }
`;

const TagsWrapper = styled.div`
    width: 47%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const ActionsWrapper = styled.div`
    width: 35%;
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    @media (max-width: 767px) {
        width: 100%;
        margin-left: 0px;
        margin-top: 20px;
    }
`;

const NewTagWrapper = styled.div`
    display: flex;
    border: 1px solid #d3d3d3;
    border-top: none;
    justify-content: space-between;
    align-items: center;
`;

const NewTagInput = styled.input`
    padding: 1rem;
    width: 90%;
    border: none;
    border-radius: 3px;
`;

const Icon = styled.i`
    color: #1a82d6;
    margin-right: 0.5rem;
    font-size: 20px;
    cursor: pointer;
`;

const ButtonsWrapper = styled.div`
    margin-top: 20px;
    width: 140px;
    display: flex;
    justify-content: space-between;
    align-self: flex-end;
    align-items: center;
`;

const ButtonLink = styled.a`
    color: ${p => p.color};
    :hover {
        text-decoration: none;
        color: ${p => p.color};
    }
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

        let slug, desc, id;

        if (taxonomies.length > 0) {
            slug = taxonomies[selectedIndex].slug;
            desc = taxonomies[selectedIndex].desc;
            id = taxonomies[selectedIndex].id;
        }
        const isMobile = true;
        const open = isMobile ? (TaxonomyClicked ? true : false) : true;
        return (
            <section className="module-xs">
                <div className="card">
                    <div className="module-title">
                        {this.defaultText.title1}
                    </div>
                    <div className="module-subtitle">
                        {this.defaultText.subtitle1}
                    </div>
                    <Wrapper className="p-t-10">
                        <TagsWrapper>
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
                                <NewTagInput
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
                        </TagsWrapper>
                        <ActionsWrapper>
                            <div className="form-group">
                                <label className="custom-label">
                                    {t("common.slug")}
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your blog's title"
                                    value={slug ? slug : ""}
                                    onChange={this.handleChange}
                                    name="slug"
                                />
                            </div>

                            <div className="form-group">
                                <label className="custom-label">
                                    {t("common.description")}
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder={`Enter a short description about the ${slug} tag. This maybe used by some themes`}
                                    name="desc"
                                    onChange={this.handleChange}
                                >
                                    {desc ? desc : ""}
                                </textarea>
                            </div>

                            <ButtonsWrapper>
                                <ButtonLink
                                    href="#"
                                    color="#d40c31"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.deleteTax();
                                    }}
                                >
                                    Delete tag
                                </ButtonLink>
                                <button
                                    className="btn btn-sm btn-dark"
                                    onClick={() => this.editSaveTaxonomy(id)}
                                >
                                    Save
                                </button>
                            </ButtonsWrapper>
                        </ActionsWrapper>
                    </Wrapper>
                </div>
            </section>
        );
    }
}

export default translate("translations")(
    DeleteTaxonomy(UpdateTaxonomy(GetTaxonomies(Taxonomy)))
);
