import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import styled from "styled-components";
import sizeMe from "react-sizeme";

import GetTaxonomies from "../../data-connectors/GetTaxonomies";
import UpdateTaxonomy from "../../data-connectors/UpdateTaxonomy";
import DeleteTaxonomy from "../../data-connectors/DeleteTaxonomy";
import Dropdown from "./Dropdown";

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

const Label = styled.div`
    font-weight: 700;
`;

const NewTagWrapper = styled.div`
    display: flex;
    border: 1px solid #d3d3d3;
    justify-content: space-between;
    align-items: center;
`;

const NewTagInput = styled.input`
    padding: 1rem;
    width: 90%;
    border: none;
    border-radius: 3px;
`;

const SlugInput = styled.input`
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    margin-bottom: 15px;
`;

const DescInput = styled.textarea`
    padding: 0.5em;
    width: 100%;
    height: 120px;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    margin-bottom: 15px;
`;

const Icon = styled.i`
    color: #1a82d6;
    margin-right: 0.5rem;
    font-size: 20px;
    cursor: pointer;
`;

const ButtonsWrapper = styled.div`
    margin-top: 20px;
    width: 170px;
    display: flex;
    justify-content: space-between;
    align-self: flex-end;
`;

const Button = styled.button`
    padding: 6px 20px;
    background-color: ${p => p.background};
    color: ${p => p.color};
    border: none;
    font-weight: 600;
    &:focus {
        outline: 0;
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
        size: PropTypes.object.isRequired
    };

    static contextTypes = {
        t: PropTypes.func
    };

    constructor(props, context) {
        super(props);
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
        this.state = {
            taxonomies: [],
            selected: {},
            newTagName: "",
            selectedIndex: 0,
            dropdownClicked: false
        };
    }

    componentDidMount() {
        document.body.classList.add("taxonomy-" + this.props.type + "-page");
    }

    componentWillUnmount() {
        document.body.classList.remove("taxonomy-" + this.props.type + "-page");
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.loading && prevState.taxonomies.length === 0) {
            return {
                taxonomies: [...nextProps.taxonomies],
                selected: nextProps.taxonomies[0]
            };
        }
        return null;
    }

    editSaveTaxonomy = async id => {
        const { taxonomies, selected } = this.state;
        const { type, updateTaxonomy } = this.props;
        const item = { ...taxonomies.filter(t => t.id === id)[0], type };

        // merge new changes into this item
        const changedItem = { ...item, ...selected, edit: 1 };

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
                selected: newState[newState.length - 1],
                selectedIndex: newState.length - 1,
                newTagName: ""
            });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState(s => ({ selected: { ...s.selected, [name]: value } }));
    };

    handleSelect = index => {
        this.setState(s => ({ selected: s.taxonomies[index] }));
    };

    handleDropdownClick = () => {
        this.setState(s => ({ dropdownClicked: !s.dropdownClicked }));
    };

    deleteTax = id => {
        const { deleteTaxonomy } = this.props;
        this.setState(
            s => ({ taxonomies: s.taxonomies.filter(t => t.id !== id) }),
            () => deleteTaxonomy({ id })
        );
    };

    render() {
        const { t } = this.context;
        const {
            taxonomies,
            selected: { id, desc, slug },
            newTagName,
            dropdownClicked
        } = this.state;
        const { loading, networkStatus, size } = this.props;
        const isLoading = loading || !networkStatus === 2;

        const isMobile = size.width <= 767;
        const open = isMobile ? (dropdownClicked ? true : false) : true;
        return (
            !isLoading && (
                <section className="module-xs">
                    <div className="card">
                        <div className="module-title">
                            {this.defaultText.title1}
                        </div>
                        <div className="module-subtitle">
                            {this.defaultText.subtitle1}
                        </div>
                        <Wrapper>
                            {!open && <Label>Tag</Label>}
                            <TagsWrapper>
                                <Dropdown
                                    numRows={5}
                                    rowHeight={44}
                                    items={taxonomies || []}
                                    selectedIndex={this.state.selectedIndex}
                                    handleSelect={this.handleSelect}
                                    handleDropdownClick={
                                        this.handleDropdownClick
                                    }
                                    isMobile={isMobile}
                                    open={open}
                                    dropdownClicked={dropdownClicked}
                                />
                                {open && (
                                    <NewTagWrapper>
                                        <NewTagInput
                                            value={newTagName}
                                            onChange={this.handleNewTagName}
                                            placeholder="Add a new tag..."
                                        />
                                        <Icon
                                            className="fa fa-plus"
                                            onClick={this.saveNewTag}
                                        />
                                    </NewTagWrapper>
                                )}
                            </TagsWrapper>
                            <ActionsWrapper>
                                <Label>{t("common.slug")}</Label>
                                <div>
                                    <SlugInput
                                        type="text"
                                        name="slug"
                                        value={slug ? slug : ""}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <Label>{t("common.description")}</Label>
                                <div>
                                    <DescInput
                                        type="text"
                                        name="desc"
                                        value={desc ? desc : ""}
                                        placeholder={`Some description about the ${slug} tag here, with some maximum character limit`}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <ButtonsWrapper>
                                    <Button
                                        color="red"
                                        background="white"
                                        onClick={() => this.deleteTax(id)}
                                    >
                                        Delete tag
                                    </Button>
                                    <Button
                                        color="white"
                                        background="#1a82d6"
                                        onClick={() =>
                                            this.editSaveTaxonomy(id)
                                        }
                                    >
                                        Save
                                    </Button>
                                </ButtonsWrapper>
                            </ActionsWrapper>
                        </Wrapper>
                    </div>
                </section>
            )
        );
    }
}

export default DeleteTaxonomy(
    UpdateTaxonomy(GetTaxonomies(sizeMe()(Taxonomy)))
);
