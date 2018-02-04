import React, { Component } from "react";
import Nestable from "react-nestable";
import List, { ListItem, ListItemText } from "material-ui/List";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from "material-ui/ExpansionPanel";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";

const Handler = () => {
    return <span />;
};
class RenderItem extends Component {
    render() {
        const slugHelperText =
            this.props.item.type == "page"
                ? "You can change this from the page."
                : "";

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography handler={this.props.handler}>
                        {this.props.handler}
                        {this.props.item.label} ({this.props.item.type})
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                    <TextField
                        label="Name"
                        value={this.props.item.label}
                        InputLabelProps={{
                            shrink: true
                        }}
                        placeholder="Name to be displayed in the menu"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Slug"
                        value={this.props.item.slug}
                        InputLabelProps={{
                            shrink: true
                        }}
                        disabled={this.props.item.type === "page"}
                        placeholder="Rewrite the slug"
                        fullWidth
                        margin="normal"
                        helperText={slugHelperText}
                    />
                    <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <IconButton
                            aria-label="Delete"
                            onClick={() =>
                                this.props.removeItem(this.props.item)
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const Resources = ({ data, itemClicked }) => {
    return (
        <Paper>
            <List>
                {data.map((item, i) => {
                    const disabled = item.disabled ? { disabled: true } : {};
                    return (
                        <ListItem
                            button
                            key={i}
                            onClick={() => itemClicked(i)}
                            {...disabled}
                        >
                            <ListItemText primary={item.label} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};
/**
 * A utility function to index menu items including children for faster searching
 * @param {*} arr
 */
var getMenuItems = function(arr) {
    var toReturn = {};
    const recur = arr => {
        arr.forEach(item => {
            if (item.children && item.children.length > 0) {
                recur(item.children);
            }
            toReturn[item.id] = true;
        });
    };
    recur(arr);
    return toReturn;
};

class MenuConstruction extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        let menu = JSON.parse(this.props.data.menu.value);

        this.state = {
            categories: [],
            pages: [],
            items: [...menu],
            labels: [
                {
                    id: Date.now() + "-label",
                    label: "Label",
                    type: "label"
                }
            ]
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.categories.loading && !nextProps.pages.loading) {
            let menu = JSON.parse(this.props.data.menu.value);
            const menuIds = getMenuItems(menu);
            const categories = nextProps.categories.taxonomies.map(
                (ele, idx) => {
                    return {
                        id: ele.id + "-category",
                        label: ele.name,
                        type: "category",
                        disabled: menuIds[ele.id + "-category"] ? true : false
                    };
                }
            );

            const pages = nextProps.pages.posts.rows.map((ele, idx) => {
                return {
                    id: ele.id + "-page",
                    label: ele.title,
                    slug: ele.slug,
                    type: "page",
                    disabled: menuIds[ele.id + "-page"] ? true : false
                };
            });
            this.setState({ categories, pages });
        }
    }
    addItem(idx, type) {
        const newState = {};
        if (type === "labels") {
            this.state[type][idx] = {
                ...this.state[type][idx],
                id: Date.now() + "-label"
            };
        } else {
            // disable the item
            newState[type] = this.state[type].map((item, i) => {
                if (i === idx) {
                    item.disabled = true;
                }
                return item;
            });
        }
        //  add the item in the menu
        newState.items = [...this.state.items, this.state[type][idx]];
        this.setState(newState);
        this.props.updateOption("menu", JSON.stringify(this.state.items));
    }

    removeItem(menuItem) {
        const itemsRemoved = [];

        const keepItemBack = item => {
            const type = item.type == "page" ? "pages" : "categories";
            this.state[type] = this.state[type].map(_item => {
                if (item.id === _item.id) {
                    _item.disabled = false;
                }
                return _item;
            });
        };

        let oldMenu = [...this.state.items];

        const findItems = (node, menuNode = false) => {
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
                nodeFromMenu.children.map(node => findItems(node, true));
                delete node.children;
            }
            if (node.type === "label") return;
            keepItemBack(node);
        };
        findItems(menuItem);

        //  remove the item from the menu
        const removeIdFromMenu = (menu, id) => {
            menu.forEach((item, idx) => {
                if (item.id !== menuItem.id) {
                    if (item.children && item.children.length > 0) {
                        removeIdFromMenu(item.children, id);
                    }
                } else {
                    menu = menu[idx].splice(idx, 1);
                }
            });
        };
        removeIdFromMenu(this.state.items, menuItem.id);

        this.setState({
            ...this.state,
            items: this.state.items,
            categories: [...this.state.categories],
            pages: [...this.state.pages]
        });
        this.props.updateOption("menu", JSON.stringify(this.state.items));
    }

    onChange(items) {
        let allowChange = true;
        const isChangeAllowed = node => {
            if (node.children && node.children.length > 0) {
                if (node.type == "category" || node.type == "page") {
                    allowChange = false;
                } else {
                    node.children.map(node => isChangeAllowed(node));
                }
            }
        };
        items.map(node => isChangeAllowed(node));
        if (allowChange) {
            this.setState({ items });
        } else {
            this.setState({ items: this.state.items });
        }
        this.props.updateOption("menu", JSON.stringify(this.state.items));
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-4">
                    <Resources
                        data={this.state.pages}
                        itemClicked={idx => this.addItem(idx, "pages")}
                    />
                    <br />
                    <Resources
                        data={this.state.categories}
                        itemClicked={idx => this.addItem(idx, "categories")}
                    />
                    <br />
                    <Resources
                        data={this.state.labels}
                        itemClicked={idx => this.addItem(idx, "labels")}
                    />
                </div>
                <div className="col-lg-4">
                    <Nestable
                        items={this.state.items}
                        renderItem={props => (
                            <RenderItem
                                {...props}
                                removeItem={this.removeItem}
                            />
                        )}
                        handler={Handler}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}
export default MenuConstruction;
