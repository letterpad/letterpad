import React, {Component} from 'react';
import {Link} from 'react-router'
import SocialButtons from '../components/SocialButtons'

export default class Header extends Component {

	render() {

		return (  
			<article className={this.props.classes}>
				<div className='card'>
					<header>
						<Link to={'/post/' + this.props.post.url }>
							<div className="media">
								<img width='100%' src={this.props.post.images.standard_resolution.url }/>
							</div>
						</Link>
					</header> 
					<div className='content-area'>
						<div className='content'>{this.props.post.body }</div>
						<footer>
							<div className='share pull-left'> 
								<SocialButtons post={this.props.post}/>
							</div>
							<div className='comment-count pull-right'> 
								<a target='_blank' href='https://www.instagram.com/p/-T1WIcPdWJ/' className='btn btn-default btn-xs btn-social-icon btn-fb'> 
									<i className='fa fa-heart'></i><span> {this.props.post.likes}</span> 
								</a> 
								<a href='http://cliptales.com/instapost/swing/' className='btn btn-default btn-xs btn-social-icon btn-fb'> 
									<i className='fa fa-comments'></i><span> {this.props.post.comments}</span> 
								</a> 
							</div>
							<div className='clearfix'/>
						</footer>
					</div>
				</div>
			</article>
		)
	}
}
