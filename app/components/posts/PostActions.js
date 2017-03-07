export function insertFeaturedImage(files) {
    this.props.uploadCoverImage(files, this.props.post.data.id);
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
        ...this.props.post.data,
        taxonomies: {
            ...this.childData,
        },
        status: data.status,
        title: this.titleInput.value,
        body: tinyMCE.activeEditor.getContent(),
        excerpt: "",
    };

    this.props.updatePost(newData);
}
export function openUploadWindow() {
    this.refs.uploadInput.click();
}
export function setTaxonomies(data) {
    this.childData = {
        ...this.childData,
        ...data,
    };
}
