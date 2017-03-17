import fetch from "isomorphic-fetch";

// export function uploadFile(files) {
//     let url = "http://localhost:3030/upload";

//     var data = new FormData();
//     data.append("file", files[0]);

//     return fetch(url, {
//         method: "post",
//         body: data
//     }).then(data => {
//         return data.json();
//     });

// }

// export function removeFeaturedImage() {
//     this.props.removeFeaturedImage(this.props.post.data.id);
// }

// export function insertImageInPost() {
//     var files = this.refs.uploadInput.files;

//     if (files.length > 0) {
//         this.props.uploadFiles(files, this.props.post.data.id, response => {
//             var ed = tinyMCE.activeEditor; // get editor instance
//             var range = ed.selection.getRng(); // get range
//             var newNode = ed.getDoc().createElement("img"); // create img node
//             newNode.src = response; // add src attribute
//             range.insertNode(newNode);
//         });
//     }
// }

// export function updatePost(data) {
//     let newData = {
//         id: this.state.post.id,
//         taxonomies: [
//             ...this.childData.post_tag,
//             ...this.childData.post_category
//         ],
//         status: data.status,
//         title: this.titleInput.value,
//         body: tinyMCE.activeEditor.getContent(),
//         excerpt: ""
//     };
//     return this.props.update(newData);
// }
// export function openUploadWindow() {
//     this.refs.uploadInput.click();
// }
// export function setTaxonomies(data) {
//     this.childData = {
//         ...this.childData,
//         ...data
//     };
// }

let PostActions = {
    // constructor() {
    //     this.data = {}
    //     this.taxonomies = [];
    // }
    data: {},
    subscribers: {},
    taxonomies: {},

    uploadFile: (files, url) => {
        var data = new FormData();
        data.append("file", files[0]);

        return fetch(url, {
            method: "post",
            body: data
        }).then(data => {
            return data.json();
        });
    },
    postUpdated: function(data) {
        for(let subscriber in PostActions.subscribers) {
            PostActions.subscribers[subscriber](data);
        }
    },
    subscribe: function(subscriber) {
        PostActions.subscribers[subscriber] = subscriber;
    },
    // removeFeaturedImage: () => {},

    // insertImageInPost: () => {},

    // updatePost: () => {
    //     return PostActions.props.update(PostActions.getData());
    // },

    setData: data => {
        PostActions.data = {
            ...PostActions.data,
            ...data
        };
    },

    getData: () => {
        let taxonomies = [];
        for (let type in PostActions.taxonomies) {
            PostActions.taxonomies[type].forEach(obj => {
                taxonomies.push(obj);
            });
        }
        PostActions.data.taxonomies = taxonomies;
        return PostActions.data;
    },

    setTaxonomies: taxonomies => {
        PostActions.taxonomies = {
            ...PostActions.getTaxonomies(),
            ...taxonomies
        };
    },

    getTaxonomies: () => {
        return PostActions.taxonomies;
    }
};

export default PostActions;
