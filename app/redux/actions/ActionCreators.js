import ActionTypes from "./ActionTypes";
import config from "../../../config/config";

import fetch from "isomorphic-fetch";
import { browserHistory } from "react-router";
import { checkHttpStatus, parseJSON } from "../../../utils/common";

let apiUrl = config.apiUrl;

/* ---------------------Login Actions -------------------------------------*/

export function loginUser(username, password, redirect = "/") {
    return function(dispatch) {
        dispatch(loginUserRequest());
        return fetch("/admin/doLogin", {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess());
                    browserHistory.push(redirect);
                } catch (e) {
                    dispatch(
                        loginUserFailure({
                            response: response
                        })
                    );
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            });
    };
}
export function loginUserRequest() {
    return {
        type: ActionTypes.LOGIN_USER_REQUEST
    };
}

export function loginUserSuccess() {
    return {
        type: ActionTypes.LOGIN_USER_SUCCESS
    };
}

export function loginUserFailure(error) {
    return {
        type: ActionTypes.LOGIN_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

/*------------------------------------------------------------------*/

export const getPosts = (page_no = 1, loadMore = false) => {
    return dispatch => {
        let url = `${config.apiUrl}/getPosts/page/${page_no}`;

        dispatch({
            type: ActionTypes.REQUEST_POSTS,
            payload: true,
            loadMore: loadMore
        });

        return fetch(url)
            .then(response => {
                return response.json();
            })
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_POSTS,
                    payload: response,
                    loadMore: false
                });
            });
    };
};

/**
 *
 * @param {number} id
 */
export const getPost = id => {
    return dispatch => {
        let url = `${config.apiUrl}/getPost/${id}`;

        dispatch({
            type: ActionTypes.REQUEST_POSTS,
            payload: true,
            loadMore: false
        });

        return fetch(url)
            .then(response => {
                return response.json();
            })
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_SINGLE_POST,
                    payload: response,
                    loadMore: false
                });
            });
    };
};

export const getTaxonomyList = () => {
    return dispatch => {
        let url = `${config.apiUrl}/getTaxonomyList`;
        return fetch(url)
            .then(response => {
                return response.json();
            })
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_TAXONOMY_LIST,
                    payload: response
                });
            });
    };
};

export const insertEmptyPost = () => {
    return function(dispatch) {
        let url = `${config.apiUrl}/insertPosts`;

        dispatch({
            type: ActionTypes.INSERTING_POST
        });
        let data = {
            title: "Draft",
            body: "",
            author: "Redsnow",
            excerpt: "",
            cover_image: "",
            type: "post",
            slug: "",
            taxonomies: {
                post_tag: [],
                post_category: [
                    { id: 8, name: "Uncategorized", type: "post_category" }
                ]
            }
        };
        return fetch(url, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [data] })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                data.id = response.id;
                data.created_at = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ");
                dispatch({
                    type: ActionTypes.INSERTING_POST_COMPLETE,
                    payload: data
                });
            })
            .catch(error => {
                dispatch({
                    type: ActionTypes.INSERTING_POST_COMPLETE,
                    msg: "Server Error"
                });
            });
    };
};

export const updatePost = data => {
    return function(dispatch) {
        let url = `${config.apiUrl}/updatePost`;
        dispatch({
            type: ActionTypes.UPDATING_POST
        });

        return fetch(url, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: data })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch({
                    type: ActionTypes.UPDATING_POST_COMPLETE
                });
                dispatch({
                    type: ActionTypes.GET_SINGLE_POST,
                    payload: response,
                    loadMore: false
                });
                dispatch(getTaxonomyList());
            })
            .catch(error => {
                dispatch({
                    type: ActionTypes.UPDATING_POST_COMPLETE,
                    msg: "Server Error"
                });
            });
    };
};

export const uploadCoverImage = (files, post_id) => {
    return function(dispatch) {
        let url = `${config.apiUrl}/uploadCoverImage`;
        // dispatch({
        //     type: ActionTypes.UPDATING_POST
        // });
        var data = new FormData();
        data.append("file", files[0]);
        data.append("post_id", post_id);

        return fetch(url, {
            method: "post",
            body: data
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch({
                    type: ActionTypes.UPDATING_COVER_IMAGE,
                    payload: response
                });
            })
            .catch(error => {});
    };
};

export const uploadFiles = (files, post_id, cb) => {
    return function(dispatch) {
        let url = `${config.apiUrl}/uploadFile`;
        // dispatch({
        //     type: ActionTypes.UPDATING_POST
        // });
        var data = new FormData();
        data.append("file", files[0]);
        data.append("post_id", post_id);

        return fetch(url, {
            method: "post",
            body: data
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                cb(response);
            })
            .catch(error => {});
    };
};

export const removeFeaturedImage = (post_id, cb) => {
    return function(dispatch) {
        let url = `${config.apiUrl}/removeFeaturedImage`;

        return fetch(url, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ post_id: post_id })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                cb(response);
            })
            .catch(error => {});
    };
};
