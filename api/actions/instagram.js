import { insertConnection } from './connections'
//these two should not be used.. check this
require('es6-promise').polyfill();
require('isomorphic-fetch');

export function handleIgAuth(req) {

    return new Promise((resolve,reject) => {
        let access_token = req.body.access_token;
        let user_id = req.body.user_id;
        fetch(`https://api.instagram.com/v1/users/${user_id}/?access_token=${access_token}`)
            .then((response) => {
                if(response.status >= 400) {
                    reject({
                        status: response.status,
                        msg: 'Bad Response from Server'
                    });
                }
                return response.json();
            })
            .then((response) => {
                let data = {};
                data.network = 'instagram';
                data.access_token = access_token;
                data.user = response.data;
                insertConnection(data).then(() => resolve({status: response.status}));
            })
        
    });
}
