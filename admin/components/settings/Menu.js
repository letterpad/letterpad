import React, { Component } from "react";
import Select from "react-select";

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            searchable: true,
            selectValue: this.props.menuId,
            clearable: true,
            rtl: false,
            slug: this.props.item.slug
        };
        this.updateValue = this.updateValue.bind(this);
    }

    updateValue(newValue) {
        this.setState({
            selectValue: newValue
        });
        let id = newValue.split(":")[0];
        let type = newValue.split(":")[1];
        this.props.onDDChange(id, type, this.props.index);
    }

    render() {
        const DeleteBtn = ({ onDelete, index }) => {
            return (
                <button
                    style={{ padding: "6px 9px" }}
                    onClick={e => onDelete(e, index)}
                    className="btn-xs btn btn-danger"
                >
                    Remove
                </button>
            );
        };

        let index = this.props.index;
        let slugOpts =
            this.props.item.type == "page" ? { disabled: "disabled" } : {};
        let homeChecked =
            this.props.item.home == "true" ? { checked: "checked" } : {};

        return (
            <tr>
                <td>
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            className="checkthis"
                            {...homeChecked}
                            onChange={e =>
                                this.props.onHomeChange(e.target.checked, index)
                            }
                        />
                        <div
                            className="control__indicator"
                            style={{ top: "10px" }}
                        />
                    </label>
                </td>
                <td>
                    <Select
                        id="page-select"
                        options={this.props.data}
                        simpleValue
                        clearable={this.state.clearable}
                        name="selected-state"
                        disabled={this.state.disabled}
                        value={this.state.selectValue}
                        onChange={this.updateValue}
                        rtl={this.state.rtl}
                        openOnClick={true}
                        searchable={this.state.searchable}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={this.props.item.label}
                        className="form-control"
                        onChange={e =>
                            this.props.onLabelChange(e.target.value, index)
                        }
                    />
                </td>
                <td>
                    <input
                        type="text"
                        ref="slug"
                        className="form-control"
                        value={this.props.item.slug}
                        {...slugOpts}
                        onChange={e =>
                            this.props.onSlugChange(e.target.value, index)
                        }
                    />
                </td>
                <td>
                    <input
                        type="text"
                        defaultValue={this.props.item.priority}
                        className="form-control"
                        onBlur={e =>
                            this.props.onPriorityChange(e.target.value, index)
                        }
                    />
                </td>
                <td>
                    {index !== 0 && (
                        <DeleteBtn
                            onDelete={this.props.onDelete}
                            index={index}
                        />
                    )}
                </td>
            </tr>
        );
    }
}

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        let menu = JSON.parse(this.props.data.menu.value);
        this.state = {
            menu: menu,
            loaded: false,
            data: []
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.loaded) return;

        if (!nextProps.pages.loading) {
            const categories = nextProps.categories.map((ele, idx) => {
                return {
                    value: ele.id + ":category",
                    label: ele.name + " (Category)",
                    type: "cateogry",
                    id: ele.id,
                    name: ele.name
                };
            });

            const pages = nextProps.pages.posts.rows.map((ele, idx) => {
                return {
                    value: ele.id + ":page",
                    label: ele.title + " (Page)",
                    slug: ele.slug,
                    type: "page",
                    id: ele.id,
                    name: ele.title
                };
            });
            this.state.data = categories.concat(pages);
            this.state.loaded = true;
            this.setState(this.state);
        }
    }

    onHomeChange(value, index) {
        this.state.menu = this.state.menu.map(item => {
            item.home = "false";
            return item;
        });
        this.state.menu[index].home = "true";
        this.setState(this.state.menu);
        this.updateOption();
    }
    onDDChange(newId, type, index) {
        this.state.menu[index].id = newId;
        this.state.menu[index].type = type;

        this.state.data.map((ele, idx) => {
            if (ele.id == newId) {
                if (type == "page") {
                    this.state.menu[index].slug = ele.slug;
                    this.state.menu[index].label = ele.name;
                } else {
                    this.state.menu[index].slug = "";
                    this.state.menu[index].label = ele.name;
                }
            }
        });

        this.setState(this.state.menu);
        this.updateOption();
    }
    onLabelChange(value, index) {
        this.state.menu[index].label = value;
        this.setState(this.state.menu);
        this.updateOption();
    }

    onSlugChange(value, type, index) {
        this.state.menu[index].slug = value;
        this.setState(this.state.menu);
        this.updateOption();
    }
    onPriorityChange(value, index) {
        this.state.menu[index].priority = value;
        this.setState(this.state.menu, () => {
            this.updateOption();
        });
    }
    updateOption() {
        //console.log(this.state.menu);
        const menu = [...this.state.menu];
        const sorted = menu.sort((a, b) => {
            return a.priority - b.priority;
        });
        this.props.updateOption("menu", JSON.stringify(sorted));
    }
    addItem() {
        this.state.menu.push({
            home: false,
            id: 0,
            label: "",
            slug: "",
            priority: ""
        });
        this.setState(this.state);
    }
    onDelete(e, index) {
        this.state.menu.splice(index, 1);
        this.setState(this.state);
        this.updateOption();
    }

    render() {
        if (this.props.pages.loading) {
            return <div>Loading</div>;
        }

        let menu = this.state.menu.map((item, idx) => {
            return (
                <MenuItem
                    key={idx}
                    index={idx}
                    item={item}
                    menuId={item.id + ":" + item.type}
                    data={this.state.data}
                    updateOption={this.updateOption}
                    onDDChange={this.onDDChange.bind(this)}
                    onLabelChange={this.onLabelChange.bind(this)}
                    onSlugChange={this.onSlugChange.bind(this)}
                    onPriorityChange={this.onPriorityChange.bind(this)}
                    onDelete={this.onDelete.bind(this)}
                    onHomeChange={this.onHomeChange.bind(this)}
                />
            );
        });
        return (
            <div>
                <div className="form-group">
                    <button
                        className="btn btn-xs btn-dark btn-circle"
                        onClick={this.addItem.bind(this)}
                    >
                        <i className="fa fa-plus" />
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">Home</th>
                                <th width="30%">Menu Item</th>
                                <th width="20%%">Label</th>
                                <th width="20%0%">Slug</th>
                                <th width="10%">Priority</th>
                                <th width="10%">Delete</th>
                            </tr>
                        </thead>
                        <tbody>{menu}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}
