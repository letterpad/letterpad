import fetch from "isomorphic-fetch";

export function uploadFile(files) {
    let url = "http://localhost:3030/upload";

    var data = new FormData();
    data.append("file", files[0]);

    return fetch(url, {
        method: "post",
        body: data
    }).then(data => {
        return data.json();
    });
    
}

export function removeFeaturedImage() {
    this.props.removeFeaturedImage(this.props.post.data.id);
}

export function insertImageInPost() {
    var files = this.refs.uploadInput.files;

    if (files.length > 0) {
        this.props.uploadFiles(files, this.props.post.data.id, response => {
            var ed = tinyMCE.activeEditor; // get editor instance
            var range = ed.selection.getRng(); // get range
            var newNode = ed.getDoc().createElement("img"); // create img node
            newNode.src = response; // add src attribute
            range.insertNode(newNode);
        });
    }
}

export function updatePost(data) {
    let newData = {
        id: this.props.posts[0].id,
        taxonomies: [
            ...this.childData.post_tag,
            ...this.childData.post_category
        ],
        status: data.status,
        title: this.titleInput.value,
        body: tinyMCE.activeEditor.getContent(),
        excerpt: ""
    };
    this.props.update(newData);
}
export function openUploadWindow() {
    this.refs.uploadInput.click();
}
export function setTaxonomies(data) {
    this.childData = {
        ...this.childData,
        ...data
    };
}
