import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import { withStyles } from "material-ui/styles";
import MenuIcon from "material-ui-icons/Menu";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import List from "material-ui/List";
import classNames from "classnames";
import Menu, { MenuItem } from "material-ui/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";

const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        position: "absolute",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    hide: {
        display: "none"
    },
    flex: {
        flex: 1
    }
});

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserClose = this.handleUserClose.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            anchorEl: null
        };
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleLogout() {
        console.log("hello");
        return false;
    }

    handleUserClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        const {
            classes,
            theme,
            navDrawerOpen,
            handleDrawerToggle
        } = this.props;

        const open = Boolean(this.state.anchorEl);
        return (
            <AppBar
                className={classNames(
                    classes.appBar,
                    navDrawerOpen && classes.appBarShift
                )}
            >
                <Toolbar disableGutters={!navDrawerOpen}>
                    <IconButton
                        color="contrast"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        className={classNames(
                            classes.menuButton,
                            navDrawerOpen && classes.hide
                        )}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        type="title"
                        color="inherit"
                        noWrap
                        className={classes.flex}
                    >
                        PAPERBOAT
                    </Typography>

                    <div>
                        <IconButton
                            aria-owns={open ? "menu-appbar" : null}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="contrast"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                            open={open}
                            onClose={this.handleUserClose}
                        >
                            <MenuItem onClick={this.handleUserClose}>
                                <Link to="/admin/edit-profile">Profile</Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleUserClose}>
                                <Link
                                    to="/admin/posts"
                                    onClick={this.handleLogout}
                                >
                                    Logout
                                </Link>
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Header);
