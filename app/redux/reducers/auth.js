import ActionTypes from '../actions/ActionTypes';
import jwtDecode from 'jwt-decode';

const initialState = {
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null
};

export default function auth(state = initialState, action) {

    switch (action.type) {
        case ActionTypes.LOGIN_USER_REQUEST:
            return {
                ...state,
                isAuthenticating: true
            }
        case ActionTypes.LOGIN_USER_SUCCESS:
            return Object.assign({}, state, {
                'isAuthenticating': false,
                'isAuthenticated': true,
                'statusText': 'You have been successfully logged in.'
            });
        case ActionTypes.LOGIN_USER_FAILURE:
            return Object.assign({}, state, {
                'isAuthenticating': false,
                'isAuthenticated': false,
                'statusText': `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            });
        case ActionTypes.LOGOUT_USER:
            return Object.assign({}, state, {
                'isAuthenticated': false,
                'statusText': 'You have been successfully logged out.'
            });
        default:
            break;
    }
    return state;
}