var ActionTypes     = require('../actions/ActionTypes');
import siteConfig from '../../../config/site.config'

import moment from 'moment'

const defaultTitle = 'Instagram Title';

var initalState = {
	data: [],
	loading: false
}

function filterByTag(data, tag) {

	return data.filter(function(item, index){
		return (item.tags.indexOf(tag) >= 0)
	})

}

function getTitleFromTags(tags) {
	let title = defaultTitle;
	tags.map((tag) => {
		if(tag.indexOf('title_') >= 0) {
			title = tag.split(siteConfig.title_tag_start)[1]
		}
	})
	return title;
}

function formatData(data) {

	let formattedData = [];
	data.forEach((item) => {
		let title = getTitleFromTags(item.tags);
		let post = {
			title: title,
			body: item.caption.text,
			author: item.caption.from.full_name,
			likes: item.likes.count,
			comments: item.comments.count,
			created_on: moment.unix(item.created_time).format("YYYY-MM-DD HH:mm:ss"),
			images: item.images,
			tags: item.tags.join(', '),
			post_id: item.id,
			url: (title == defaultTitle) ? Math.floor((Math.random() * 100000) + 1) : title.replace(/ /g,'-'),
			refer_url: item.link,
		};
		formattedData.push(post);
	})
	return formattedData;
}

function instagram(state=initalState, action) {

	
	switch(action.type) {
		case ActionTypes.GET_IG_IMAGES:

			let filteredData = filterByTag(action.payload, siteConfig.tag_sync);
			let formattedData = formatData(filteredData);

			return {
				...state,
        		data: [...state.data, ...formattedData],
        		loading: false
	      	};
      	case ActionTypes.REQUEST_IG_IMAGES:
			return {
				...state,
				loading: true
	      	};
  		default:
  			break;


	}
	return state;
}

export default instagram;
