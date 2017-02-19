import React, { Component } from 'react';
import {Link} from 'react-router'
import Comments from './Comments'

export default class SidebarWrapper extends Component {
    
    constructor(props){
        super(props);
    }
    
    render() {
    	let sidebars = this.props.sidebars.map((sidebar, i) => {
    		return (
    			<section key={i} className="widget">      
                	{sidebar}
                </section>
			)
    	})
        return (
            <div className="col-xs-6 col-sm-4 sidebar-offcanvas" id="sidebar" role="navigation">
                {sidebars}
            </div>
        )
    }
};
