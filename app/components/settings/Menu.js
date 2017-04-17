import React, { Component } from "react";
import ReactDOM from "react-dom";

const MenuItem = (
    { menuId, label, categories, onDDChange, onLabelChange, onDelete, index }
) => {
    let dropdown = categories.map((ele, idx) => {
        return (
            <option key={idx} value={ele.id}>
                {ele.name}
            </option>
        );
    });
    return (
        <div className="form-group">
            <label className="control-label col-sm-2">
                <select onChange={e => onDDChange(e, index)} value={menuId}>
                    <option value="0">Select</option>
                    {dropdown}
                </select>
            </label>
            <div className="col-sm-8">
                <input
                    type="text"
                    defaultValue={label}
                    className="form-control"
                    onBlur={e => onLabelChange(e, index)}
                />

            </div>
            <div className="col-sm-2">
                <button
                    onClick={e => onDelete(e, index)}
                    className="btn-xs btn"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        let menu = JSON.parse(this.props.data.menu.value);
        this.state = {
            menu: menu
        };
    }
    onDDChange(e, index) {
        let newId = e.target.value;
        this.state.menu[index].id = newId;
        this.setState(this.state.menu);
        this.updateOption();
    }
    onLabelChange(e, index) {
        this.state.menu[index].label = e.target.value;
        this.setState(this.state.menu);
        this.updateOption();
    }
    updateOption() {
        console.log(this.state.menu);
        this.props.updateOption("menu", JSON.stringify(this.state.menu));
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
        let menu = this.state.menu.map((item, idx) => {
            return (
                <MenuItem
                    key={idx}
                    index={idx}
                    menuId={item.id}
                    label={item.label}
                    categories={this.props.categories}
                    updateOption={this.updateOption}
                    onDDChange={this.onDDChange.bind(this)}
                    onLabelChange={this.onLabelChange.bind(this)}
                    onDelete={this.onDelete.bind(this)}
                />
            );
        });
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        Menu
                    </label>
                    <button
                        className="btn btn-xs btn-dark pull-right"
                        onClick={this.addItem.bind(this)}
                    >
                        Add
                    </button>
                    <div className="form-horizontal">
                        {menu}
                    </div>
                </div>
            </div>
        );
    }
}
