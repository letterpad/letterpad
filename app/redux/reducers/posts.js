var ActionTypes = require("../actions/ActionTypes");

var initalState = {
    posts: {
        loading: true,
        count: 0,
        loadMore: false,
        data: []
    },
    post: {
        loading: true,
        count: 0,
        loadMore: false,
        data: {},
        taxonomy: {
            tags: [],
            categories: []
        }
    },
    inserting: false,
    updating: false
};

function instagram(state = initalState, action) {
    switch (action.type) {
        case ActionTypes.REQUEST_POSTS:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    loading: true
                }
            };
        case ActionTypes.GET_POSTS:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    data: action.payload.data,
                    loading: false
                }
            };
        case ActionTypes.GET_SINGLE_POST:
            return {
                ...state,
                post: {
                    ...state.post,
                    data: action.payload,
                    loading: false
                }
            };
        case ActionTypes.NEW_POST:
            return {
                ...state,
                post: {
                    ...state.post,
                    data: action.payload
                }
            };
        case ActionTypes.INSERTING_POST:
            return {
                ...state,
                inserting: true
            };
        case ActionTypes.INSERTING_POST_COMPLETE:
            return {
                ...state,
                inserting: false,
                post: {
                    ...state.post,
                    data: {
                        ...state.post.data,
                        ...action.payload
                    }
                }
            };
        case ActionTypes.UPDATING_POST:
            return {
                ...state,
                updating: true
            };
        case ActionTypes.UPDATING_POST_COMPLETE:
            return {
                ...state,
                updating: false
            };
        case ActionTypes.GET_TAXONOMY_LIST:
            return {
                ...state,
                post: {
                    ...state.post,
                    taxonomy: action.payload
                }
            };

        default:
            break;

    }
    return state;
}

export default instagram;