import path from "path";
import multer from "multer";
import models from "../models";

import { _updatePost } from "./post";

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads/"));
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

let upload = multer({ storage: storage }).single("file");

export function uploadFile(request) {
    return new Promise((resolve, reject) => {
        upload(request, null, function(err) {
            if (err) {
                return reject(err);
            }

            resolve("/uploads/" + req.file.filename);
        });
    });
}

export function uploadCoverImage(request) {
    return new Promise((resolve, reject) => {
        upload(request, null, function(err) {
            if (err) {
                return reject(err);
            }
            let data = {
                cover_image: "/uploads/" + params.filename,
                id: params.post_id
            };
            _updatePost(data, models).then(result => {
                resolve("/uploads/" + params.filename);
            });
        });
    });
}

export function removeFeaturedImage(req, params) {
    return new Promise((resolve, reject) => {
        let data = {
            cover_image: "",
            id: params.id
        };
        _updatePost(data, models).then(result => {
            resolve("/uploads/" + params.filename);
        });
    });
}
