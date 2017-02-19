import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router'
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../redux/actions/ActionCreators';
import SidebarWrapper from '../components/SidebarWrapper';
import About from '../components/About';
import Subscribe from '../components/Subscribe';
import Card from '../components/Card';
import Masonry from 'react-masonry-component';
import Helmet from 'react-helmet';
import siteConfig from '../../config/site.config'
import config from '../../config/config'

let currentPage = 1;

class LoadMore extends Component {

	constructor(props){
		super(props);
		this.handleLoadMore = this.handleLoadMore.bind(this);
	}

	loadMoreStatus() {
        if(this.props.data.length < this.props.count) {
        	return true;
        }
    }
	handleLoadMore(e) {
		e.preventDefault();
		currentPage += 1;
		this.props.getPosts(currentPage,true);
	}

	render() {
		if(!this.loadMoreStatus()) {
			return <div>Nothing to load</div>
		}
		let disabled = (this.props.loadMore) ? 'disabled' : '';
		let loader = (this.props.loadMore) ? '<img width="18" src="/images/loading.svg"/> Loading..' : ' Load More';

		return (
			<div className="col-lg-12 btn-group btn-group-justified">
				<Link disabled={disabled}
						className="btn btn-default btn-md"
						onClick={(e) => this.handleLoadMore(e)}
						dangerouslySetInnerHTML={{ __html: loader }}
				/>
			</div>
		)
	}
}

var masonryOptions = {
    transitionDuration: 500
};


class Home extends Component {

	constructor(props){
		super(props);
	}

	static prefetchData = [
		(params) => ActionCreators.getPosts(params.page_no)
	];

	componentDidMount() {
		if(!this.props.posts.posts_loaded) {
			this.props.getPosts();
		}else{
			let that = this;
			this.props.posts.data.map((post,i) => {
				if(post.images.standard_resolution.loadUrl) {
					((index) => {
						that.loadImage(post.images.standard_resolution.loadUrl, index)
						.then((index) => {
							that.props.lazyLoadFinish(index)
						})
						.catch(() => {

						})
					})(i)
				}
			})
		}
	}

	loadImage(src,index) {
        return new Promise((resolve, reject) => {
            var img = new Image()
            img.onload = () => resolve(index)
            img.onerror = () => reject(index)
            img.src = src
        })
	}

	componentWillReceiveProps(nextState) {
		let that = this;
		if(this.props.posts.data.length < nextState.posts.data.length) {
			nextState.posts.data.map((post,i) => {
				if(post.images.standard_resolution.loadUrl) {
					((index) => {
						that.loadImage(post.images.standard_resolution.loadUrl, index)
						.then((index) => that.props.lazyLoadFinish(index))
						.catch(() => {})
					})(i)
				}
			})
		}
	}

	render() {

		if(this.props.posts.data.length === 0 && this.props.posts.posts_loading && !this.props.posts.loadMore) {
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

		const posts = this.props.posts.data.map((post, i) => {
			return <Card key={i} post={ post } classes='col-sm-12 col-md-6'/>
		})
        return (
        	<div className='home'>
        		<Helmet
                    title = {siteConfig.site_title}
                    meta={[
                        {
                            property: 'og:url',
                            content: config.clientUrl
                        },
                        {
                            property: 'og:type',
                            content: 'website'
                        },
                        {
                            property: 'og:title',
                            content: siteConfig.site_title
                        },
                        {
                            property: 'og:description',
                            content: siteConfig.site_description
                        },
                        {
                            property: 'og:image',
                            content: config.clientUrl + siteConfig.site_image
                        }
                    ]}
                />
				<div className="row row-offcanvas row-offcanvas-left">
					<SidebarWrapper sidebars={[<About/>,<Subscribe/>]} />
					<div className="col-xs-12 col-sm-8" style={{'marginTop': '30px'}}>
						<section className='grid-container'>
							<Masonry options={masonryOptions} >
				                {posts}
				            </Masonry>

					 	</section>
					 	<LoadMore {...this.props.posts} getPosts={this.props.getPosts}/>
					</div>
				</div>
            </div>
        );
	}
}

const mapStateToProps = (state) => {
	return {
		posts: state.posts
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		getPosts: ActionCreators.getPosts,
		lazyLoadFinish: ActionCreators.lazyLoadFinish
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
