var ActionTypes     = require('../actions/ActionTypes');
var initalState = {
	data: [],
	loading: true
}

export default function comments(state=initalState, action) {

	switch(action.type) {
      	case ActionTypes.GET_COMMENTS:
			return {
        		data: [...action.payload],
        		loading: false,
	      	};
      	case ActionTypes.REQUEST_COMMENTS:
			return {
				data: [],
				loading: true,
	      	};
  		default:
  			break;
	}
	return state;
}
