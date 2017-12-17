import React, { Component } from "react";
import ReactDOM from "react-dom";
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
            slug: this.props.slug
        };
        this.updateValue = this.updateValue.bind(this);
    }

    componentDidMount() {
        let items = this.props.data;
        this.refs.slug.value = this.props.slug;
        for (let i = 0; i < items.length; i++) {
            if (
                this.props.menuId == items[i].value &&
                this.props.type == "page"
            ) {
                this.refs.slug.value = items[i].slug;
                this.refs.slug.disabled = true;
                this.props.onSlugChange(
                    items[i].id,
                    this.props.type,
                    this.props.index
                );
                return;
            }
        }
    }

    updateValue(newValue) {
        this.setState({
            selectValue: newValue
        });
        let id = newValue.split(":")[0];
        let type = newValue.split(":")[1];
        this.props.onDDChange(id, type, this.props.index);
    }
    // slugChanged(e) {
    //     this.state.slug = e.target.value;
    //     this.setState(this.state);
    // }

    render() {
        let index = this.props.index;
        return (
            <tr>
                <td>
                    <Select
                        id="state-select"
                        ref="stateSelect"
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
                        defaultValue={this.props.label}
                        className="form-control"
                        onBlur={e => this.props.onLabelChange(e, index)}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        ref="slug"
                        className="form-control"
                        onBlur={e => this.props.onSlugChange(e, index)}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        defaultValue={this.props.priority}
                        className="form-control"
                        onBlur={e => this.props.onPriorityChange(e, index)}
                    />
                </td>
                <td>
                    <button
                        style={{ padding: "9px" }}
                        onClick={e => this.props.onDelete(e, index)}
                        className="btn-xs btn btn-dark"
                    >
                        <i className="fa fa-trash fa-2x" aria-hidden="true" />
                    </button>
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
                    type: "cateogry"
                };
            });
            const pages = nextProps.pages.posts.rows.map((ele, idx) => {
                return {
                    value: ele.id + ":page",
                    label: ele.title + " (Page)",
                    slug: ele.slug,
                    type: "page"
                };
            });
            this.state.data = [...categories, ...pages];
            this.state.loaded = true;
            this.setState(this.state);
        }
    }

    onDDChange(newId, type, index) {
        this.state.menu[index].id = newId;
        this.state.menu[index].type = type;
        this.setState(this.state.menu);
        this.updateOption();
    }
    onLabelChange(e, index) {
        this.state.menu[index].label = e.target.value;
        this.setState(this.state.menu);
        this.updateOption();
    }

    onSlugChange(e, index) {
        this.state.menu[index].slug = e.target.value;
        this.setState(this.state.menu);
        this.updateOption();
    }
    onPriorityChange(e, index) {
        this.state.menu[index].priority = e.target.value;
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
        this.state.menu.push({ id: 0, label: "" });
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
                    type={item.type}
                    slug={item.slug}
                    menuId={item.id + ":" + item.type}
                    label={item.label}
                    priority={item.priority}
                    data={this.state.data}
                    updateOption={this.updateOption}
                    onDDChange={this.onDDChange.bind(this)}
                    onLabelChange={this.onLabelChange.bind(this)}
                    onSlugChange={this.onSlugChange.bind(this)}
                    onPriorityChange={this.onPriorityChange.bind(this)}
                    onDelete={this.onDelete.bind(this)}
                />
            );
        });
        return (
            <div>
                <div className="form-group">
                    <button
                        className="btn btn-xs btn-dark pull-right"
                        onClick={this.addItem.bind(this)}
                    >
                        Add
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="40%">Menu Item</th>
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
