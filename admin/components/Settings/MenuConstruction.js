import React, { Component } from "react";
import PropTypes from "prop-types";
import Resources from "./menu/Resources";
import SortableTree, {
    changeNodeAtPath,
    removeNodeAtPath
} from "react-sortable-tree";
import "react-sortable-tree/style.css";

import EditMenuModal from "../Modals/EditMenuModal";

/**
 * A utility function to index menu items including children for faster searching
 * @param {*} arr
 */
const getMenuItems = function(arr) {
    const toReturn = {};
    const recur = arr => {
        arr.forEach(item => {
            if (item.children && item.children.length > 0) {
                recur(item.children);
            }
            toReturn[item.id + "-" + item.type] = true;
        });
    };
    recur(arr);
    return toReturn;
};

class MenuConstruction extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        updateOption: PropTypes.func.isRequired
    };

    state = {
        loaded: false,
        categories: [],
        pages: [],
        items: [...JSON.parse(this.props.data.menu.value)],
        labels: [
            {
                id: Date.now() + "-label",
                title: "Folder",
                type: "label",
                label: "Folder",
                name: "Folder"
            }
        ],
        scrollTop: 0,
        nodeInfo: {} // node which is being edited
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            !nextProps.categories.loading &&
            !nextProps.pages.loading &&
            !prevState.loaded
        ) {
            let menu = JSON.parse(nextProps.data.menu.value);
            const menuIds = getMenuItems(menu);
            const categories = nextProps.categories.taxonomies.map(ele => {
                return {
                    id: ele.id,
                    title: ele.name,
                    type: "category",
                    name: ele.name,
                    disabled: menuIds[ele.id + "-category"] ? true : false,
                    slug: ""
                };
            });

            const pages = nextProps.pages.posts.rows.map(ele => {
                return {
                    id: ele.id,
                    title: ele.title,
                    slug: ele.slug,
                    type: "page",
                    name: ele.title,
                    disabled: menuIds[ele.id + "-page"] ? true : false
                };
            });
            return { categories, pages, loaded: true };
        }
        return null;
    }
    
    addItem = (idx, type) => {
        const newState = {};
        newState[type] = [...this.state[type]];
        if (type === "labels") {
            newState[type][idx] = {
                ...this.state[type][idx],
                id: Date.now() + "-label"
            };
        } else {
            // disable the item
            newState[type][idx].disabled = true;
        }
        if (type === "categories") {
            newState[type][idx].slug = newState[type][idx].name.toLowerCase();
        }
        //  add the item in the menu
        newState.items = [...this.state.items, newState[type][idx]];
        this.setState({ ...newState }, () => {
            this.props.updateOption("menu", JSON.stringify(this.state.items));
            const scrollContainer = document.querySelector(
                ".ReactVirtualized__Grid__innerScrollContainer"
            );
            if (scrollContainer && scrollContainer.scrollHeight > 600) {
                this.setState({ scrollTop: 9999999 });
            }
        });
    };

    removeItem = props => {
        const menuItem = props.node;

        const keepItemBack = item => {
            const type = item.type == "page" ? "pages" : "categories";
            const newState = this.state[type].map(_item => {
                if (item.id == _item.id) {
                    _item.disabled = false;
                }
                return _item;
            });

            this.setState({ [type]: newState });
        };

        const findItemsAndDelete = (node, menuNode = false) => {
            let nodeFromMenu = node;
            if (!menuNode) {
                nodeFromMenu = this.state.items.filter(
                    _node => _node.id == node.id
                )[0];
            }

            if (
                nodeFromMenu &&
                nodeFromMenu.children &&
                nodeFromMenu.children.length > 0
            ) {
                nodeFromMenu.children.map(node =>
                    findItemsAndDelete(node, true)
                );
                delete node.children;
            }
            if (node.type === "label") return;
            keepItemBack(node);
        };
        findItemsAndDelete(menuItem);

        const getNodeKey = ({ treeIndex }) => treeIndex;
        this.setState(
            () => ({
                ...this.state,
                items: removeNodeAtPath({
                    treeData: this.state.items,
                    path: props.path,
                    getNodeKey
                }),
                categories: [...this.state.categories],
                pages: [...this.state.pages]
            }),
            () => {
                this.props.updateOption(
                    "menu",
                    JSON.stringify(this.state.items)
                );
            }
        );
    };

    changeItemProperty = (e, { node, path }, property) => {
        const getNodeKey = ({ treeIndex }) => treeIndex;
        const value = e.target.value;

        this.setState(
            () => ({
                items: changeNodeAtPath({
                    treeData: this.state.items,
                    path,
                    getNodeKey,
                    newNode: {
                        ...node,
                        [property]: value
                    }
                })
            }),
            () => {
                this.props.updateOption(
                    "menu",
                    JSON.stringify(this.state.items)
                );
            }
        );
    };

    canDrop({ node, nextParent }) {
        if (!nextParent) return true;
        if (
            ["category", "page"].indexOf(node.type) >= 0 &&
            nextParent.type === "label"
        ) {
            return true;
        }
        if (node.type === "label" && nextParent.type === "label") {
            return true;
        }
        return false;
    }

    openModalToEdit = props => {
        this.setState({
            modalOpen: true,
            nodeInfo: props
        });
    };

    generateNodeProps(props) {
        return {
            buttons: [
                <span key="0" className="item-type">
                    {props.node.type}
                </span>,
                <i
                    key="1"
                    className="fa fa-pencil"
                    onClick={() => this.openModalToEdit(props)}
                />,
                <i
                    key="2"
                    className="fa fa-trash"
                    onClick={() => this.removeItem(props)}
                />
            ],
            title: (
                <div className="menu-title-wrapper">
                    <span>{props.node.title}</span>
                </div>
            )
        };
    }
    render() {
        const { t } = this.context;
        return (
            <div className="row">
                <div className="col-lg-4">
                    <Resources
                        title="Pages"
                        data={this.state.pages}
                        itemClicked={idx => this.addItem(idx, "pages")}
                    />
                    <br />
                    <Resources
                        title="Categories"
                        data={this.state.categories}
                        itemClicked={idx => this.addItem(idx, "categories")}
                    />
                    <br />
                    <Resources
                        title="Folders"
                        data={this.state.labels}
                        itemClicked={idx => this.addItem(idx, "labels")}
                    />
                </div>

                <div className="col-lg-8">
                    <h5>{t("menu.build.title")}</h5>
                    <div style={{ height: 600 }}>
                        <SortableTree
                            treeData={this.state.items}
                            onChange={treeData => {
                                this.setState({ items: treeData });
                                this.props.updateOption(
                                    "menu",
                                    JSON.stringify(treeData)
                                );
                            }}
                            reactVirtualizedListProps={{
                                scrollTop: this.state.scrollTop,
                                onScroll: ({ scrollTop }) =>
                                    this.setState({ scrollTop })
                            }}
                            canDrop={this.canDrop.bind(this)}
                            generateNodeProps={this.generateNodeProps.bind(
                                this
                            )}
                        />
                    </div>
                </div>
                {this.state.modalOpen && (
                    <EditMenuModal
                        title="Edit menu item"
                        onClose={() => {
                            this.setState({
                                nodeInfo: {},
                                modalOpen: false
                            });
                        }}
                        changeItemProperty={this.changeItemProperty}
                        nodeInfo={this.state.nodeInfo}
                    />
                )}
            </div>
        );
    }
}

MenuConstruction.contextTypes = {
    t: PropTypes.func
};

export default MenuConstruction;
