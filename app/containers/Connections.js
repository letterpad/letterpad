import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ActionCreators from '../redux/actions/ActionCreators';
import { Link } from 'react-router';

import Sidebar from '../components/Sidebar';


class Connection extends Component {

	getAccessToken(e) {
		e.preventDefault();
		window.open('https://instagram.com/oauth/authorize/?client_id=1677ed07ddd54db0a70f14f9b1435579&redirect_uri=http://instagram.pixelunion.net&response_type=token');
	}

	save(e) {
		e.preventDefault();
		this.props.saveAccessToken(this.refs.igId.value, this.refs.igToken.value);
	} 

	connectionStatus() {
		let saving = '',
			disabled = '',
			network = this.props.connections[this.props.network]

		if(network.saving) {
			saving = <img width="16" src="/images/loading.svg" />
			disabled = ' disabled';
		}
		if(network.active) {
			return (
				<div>
					<Link to="/posts" className="btn btn-sm btn-default">Configure</Link>
					<Link 
						onClick={(evt)=> this.props.disconnectNetwork(this.props.network,evt)} 
						className="btn btn-sm btn-default pull-right">
						Disconnect
					</Link>
				</div>
			)
		}else{
			return (
				<div>
					<Link 
						onClick={(evt)=> this.save(evt)} 
						disabled={disabled}
						className="btn btn-sm btn-default pull-left">
						{saving} Save
					</Link>
					<Link 
						onClick={(evt)=> this.getAccessToken(evt)} 
						className="btn btn-sm btn-default pull-right">
						Get Access Token
					</Link>
					<div className="clearfix"/>
					<span className="text-error">{network.error && network.error.msg}</span>
				</div>
			)
		}
	}

	configureMarkup(network) {

		if(this.props.connections[this.props.network].active) {
			return (
				<div>
					<span>Connection is Active</span>
				</div>
			)
		}else{
			return (
				<div>
					<span>
						<p>Due to new policy of Instagram, we will rely on third party to get the access token. </p>
						<div className="row">
							<div className="col-lg-4">
								<div className="form-group">
									<label className="control-label">Instagram User Id</label>
									<input ref="igId" type="text" className="form-control input-sm" />
								</div>
							</div>
							<div className="col-lg-8">
								<div className="form-group">
									<label className="control-label">Access Token</label>
									<input ref="igToken" type="text" className="form-control input-sm" />
								</div>
							</div>
						</div>
						<a target="_blank" href="https://smashballoon.com/instagram-feed/find-instagram-user-id/">Find user id</a>
					</span>
				</div>
			)
		}
	}

	render() {
		let connections = this.props.connections;
		
		return (
			
			<div className="panel panel-default">
			  <div className="panel-heading">
			    <h3 className="panel-title">{this.props.title}</h3>
			  </div>
			  <div className="panel-body">
			    {this.configureMarkup()}
			  </div>
			  <div className="panel-footer">{this.connectionStatus()}</div>
			</div>
		)
	}
}
class Connections extends Component {

	componentDidMount() {
		this.props.getConnections();
	}

	render() {
		if(this.props.connections.loading) {
			return (
				<span>Loading</span>
			)
		}

		return (
			<div className="page-container">
				<div className="row row-offcanvas row-offcanvas-left">
					<Sidebar 
						connectionClicked={this.props.connectionClicked}
					/>
					<div className="col-xs-12 col-sm-9">
						<p/><p/>
			        	<Connection
							title = "Instagram"
							network = "instagram"
							connections = {this.props.connections}
							connectNetwork = {this.props.connectNetwork}
							disconnectNetwork = {this.props.disconnectNetwork}
							saveAccessToken = {this.props.saveAccessToken}
						/>
					</div>
				</div>
			</div>
			
		)

	}

}

const mapStateToProps = (state) => {
  return {
    connections: state.connections
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    saveAccessToken: ActionCreators.saveAccessToken,
    connectionClicked: ActionCreators.connectionClicked,
    connectNetwork: ActionCreators.connectNetwork,
    disconnectNetwork: ActionCreators.disconnectNetwork,
    getConnections: ActionCreators.getConnections
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Connections);

