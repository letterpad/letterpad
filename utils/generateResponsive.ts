//@ts-nocheck
const env = require("node-env-file");
env(__dirname + "/../.env");
import Cloudinary from "cloudinary";
const Cloudinary = require("cloudinary");
const cheerio = require("cheerio");
import config from "../dist/config";
import models from "../dist/api/models/index";
const path = require("path");

const rootFoler = config.NODE_ENV === "production" ? "dist" : "src";

let images = {};

let key;
let name;
let secret;

async function convertLocalImageToCdn() {
  const settings = await models.Setting.findAll({ raw: true });
  settings
    .filter(item =>
      ["cloudinary_key", "cloudinary_secret", "cloudinary_name"].includes(
        item.option,
      ),
    )
    .forEach(item => {
      if (item.option === "cloudinary_key") key = item.value;
      if (item.option === "cloudinary_secret") secret = item.value;
      if (item.option === "cloudinary_name") name = item.value;
    });

  const posts = await models.Post.findAll({ raw: true });

  for (let i = 0; i < posts.length; i++) {
    images = {};
    const post = posts[i];

    post.html = await replaceInternalImagesWithCDN(post.html);

    // cover image
    if (post.cover_image.startsWith("/")) {
      let { src, width, height } = await doUpload(
        path.join(__dirname, "../", rootFoler, "/public", post.cover_image),
      );
      post.cover_image = src.replace("http:", "https:");
      post.cover_image_width = width;
      post.cover_image_height = height;
    }
    Object.keys(images).forEach(key => {
      post.md = post.md.replace(key, images[key].src);
    });
    console.log("=======================================");
    console.log("Updating post", post.id);
    console.log("Replacing", images);
    console.log("=======================================");
    await models.Post.update(post, { where: { id: post.id } });
  }

  const media = await models.Media.findAll({ raw: true });
  for (let i = 0; i < media.length; i++) {
    const item = media[i];
    if (item.url.startsWith("/")) {
      let { src, width, height } = await doUpload(
        path.join(__dirname, "../", rootFoler, "/public", item.url),
      );
      item.url = src.replace("http:", "https:");
      item.width = width;
      item.height = height;
    }
    models.Media.update(item, { where: { id: item.id } });
  }
}

async function replaceInternalImagesWithCDN(html) {
  const $ = cheerio.load(html);
  const $bodyImages = $("img");
  const host = config.ROOT_URL + config.BASE_NAME;

  for (let i = 0; i < $bodyImages.length; i++) {
    const el = $bodyImages[i];
    const $el = $(el);
    $el.attr("loading", "lazy");
    let imageSrc = $el.attr("src");
    if (imageSrc.startsWith(host)) {
      // this are internal images
      const file = path.join(
        __dirname,
        "../",
        rootFoler,
        "/public",
        imageSrc.replace(host, ""),
      );
      console.log("internal image found", file);
      //upload to cloudinary
      try {
        let { src, width, height } = await uploadToCloudinaryInternal(file);
        if (src !== "") {
          src = src.replace("http://", "https://");
          $el.attr("height", height.toString());
          $el.attr("width", width.toString());
          $el.attr("src", src);
          images[imageSrc] = { src, width, height };
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  return $.html();
}

async function uploadToCloudinaryInternal(file) {
  const cdnEnabled = key && name && secret;

  if (cdnEnabled) {
    console.log("cdn enabled", file);
    try {
      const {
        src,
        size: { width, height },
      } = await doUpload(file);

      console.log("uploaded to cloudinary", src);
      return { src, width, height };
    } catch (e) {
      console.log("cloudinary upload failed", e);
    }
  }
  return { src: "", width: "", height: "" };
}

async function doUpload(file) {
  Cloudinary.v2.config({
    api_key: key,
    cloud_name: name,
    api_secret: secret,
  });
  return new Promise((resolve, reject) => {
    try {
      Cloudinary.v2.uploader.upload(
        file,
        { folder: "blog-images/" },
        (error, result) => {
          return result
            ? resolve({
                src: result.url,
                error: "",
                name: result.public_id,
                size: {
                  width: result.width,
                  height: result.height,
                  type: result.format,
                },
              })
            : reject({
                src: "",
                error: error.message,
                name: "",
              });
        },
      );
    } catch (e) {
      console.log(e);
    }
  });
}

convertLocalImageToCdn();
