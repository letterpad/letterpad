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
    let style = {
        "border-radius": 0,
        border: "1px solid #eee",
        width: "100%",
        height: "37px"
    };
    return (
        <tr>
            <td>
                <select
                    style={style}
                    onChange={e => onDDChange(e, index)}
                    value={menuId}
                >
                    <option value="0">Select</option>
                    {dropdown}
                </select>
            </td>
            <td>
                <input
                    type="text"
                    defaultValue={label}
                    className="form-control"
                    onBlur={e => onLabelChange(e, index)}
                />
            </td>
            <td>
                <button
                    style={{ padding: "9px" }}
                    onClick={e => onDelete(e, index)}
                    className="btn-xs btn btn-dark"
                >
                    <i className="fa fa-trash fa-2x" aria-hidden="true" />
                </button>
            </td>
        </tr>
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
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Label</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu}
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
}
