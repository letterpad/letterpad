import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

export default class Header extends Component {

  render() {
        return (
            <div className="navbar navbar-default navbar-fixed-top" role="navigation">
               <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="offcanvas" data-target=".sidebar-nav">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                   <a className="navbar-brand" href="#">Cliptales</a>
                </div>
               </div>
            </div>
        )
    }
}
