import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router'
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../redux/actions/ActionCreators';
import SocialButtons from '../components/SocialButtons'
import SidebarWrapper from '../components/SidebarWrapper';
import Comments from '../components/Comments'
import Helmet from 'react-helmet';
import config from '../../config/config'

class PostView extends Component {

	static prefetchData = [
		(params) => ActionCreators.getPost(params.title)
	];

	componentDidMount() {
		if(!this.props.posts.post_loaded) {
			this.props.getPost(this.props.params.title)
		}
	}

	componentWillReceiveProps(nextState) {

		if(nextState.posts.post.post_id && (nextState.posts.post.post_id !== this.props.posts.post.post_id)) {
			this.props.getComments(nextState.posts.post.post_id);
		}
	}

	render() {
		if(this.props.posts.post_loading) {
			return (
				<div>
            		Loading..
				</div>
			)
		}
		if(this.props.posts.post_loading) {
			return (
				<div>
					<div className="row row-offcanvas row-offcanvas-left">
						<SidebarWrapper sidebars={[<About/>,<Subscribe/>]} />
						<div className="col-xs-12 col-sm-8">
							<img src="/images/loading.svg"/>
						</div>
					</div>
	            </div>
			)
		}
        let url = config.clientUrl + '/post/' + this.props.posts.post.url;
		return (
			<div className='post'>
				<Helmet
                    title={this.props.posts.post.title}
                    meta={[
                        {
                            property: 'og:url',
                            content: url
                        },
                        {
                            property: 'og:type',
                            content: 'website'
                        },
                        {
                            property: 'og:title',
                            content: this.props.posts.post.title
                        },
                        {
                            property: 'og:description',
                            content: this.props.posts.post.body
                        },
                        {
                            property: 'og:image',
                            content: this.props.posts.post.images.standard_resolution.url
                        }
                    ]}
                />
				<div className="row row-offcanvas row-offcanvas-left">
					<div className='visible-md visible-lg'>
						<SidebarWrapper sidebars={[<Comments {...this.props}/>]} />
					</div>
					<div className="col-sm-12 col-md-8" style={{'marginTop': '30px'}}>
						<section className='grid-container'>
							<article className='col-sm-12'>
								<div className='card'>
									<header>
										<div className="media">
											<img width='100%' src={this.props.posts.post.images.standard_resolution.url}/>
										</div>
									</header>
									<div className='content-area'>
									    <div className='content'>{this.props.posts.post.body }</div>
									    <p><strong>Tags: </strong> {this.props.posts.post.tags}</p>
									    <footer>
									    	<div className='share pull-left'>
									    		<SocialButtons post={this.props.posts.post}/>
								    		</div>
								    		<div className='comment-count pull-right'>
								    			<a target='_blank' href='https://www.instagram.com/p/-T1WIcPdWJ/' className='btn btn-default btn-xs btn-social-icon btn-fb'>
								    				<i className='fa fa-heart'></i><span> {this.props.posts.post.likes}</span>
								    			</a>
								    			<a href='http://cliptales.com/instapost/swing/' className='btn btn-default btn-xs btn-social-icon btn-fb'>
								    				<i className='fa fa-comments'></i><span> {this.props.posts.post.comments}</span>
								    			</a>
							    			</div>
							    			<div className='clearfix'/>
									    </footer>
								    </div>
							    </div>
						  	</article>
						</section>
						<div className='visible-xs visible-sm'>
							<Comments comments={this.props.comments} refer_url={this.props.refer_url} />
						</div>
					</div>
				</div>
            </div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		posts: state.posts,
		comments: state.comments,
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		getPost: ActionCreators.getPost,
		getComments: ActionCreators.getComments,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
