import config from "../config";

const utils = {
  parseErrors: function parseErrors(errObj) {
    let result: Array<object> = [];
    if (errObj && errObj.errors) {
      errObj.errors.map(function(_ref) {
        let message = _ref.message,
          path = _ref.path;

        result.push({ message: message, path: path });
      });
    }
    return result;
  },

  plural: {
    post: "posts",
    page: "pages",
  },

  makeUrl: function makeUrl(parts) {
    if (typeof parts === "string") {
      parts = [parts];
    }
    let url = "/" + parts.join("/");
    return url.replace(/\/\/+/g, "/").replace(":/", "://");
  },

  recurseMenu: function recurseMenu(item, id, cb) {
    if (item.children && item.children.length > 0) {
      item.children = item.children.map(function(childItem) {
        return utils.recurseMenu(childItem, id, cb);
      });
    }
    if (item.id === id) {
      // the slug of this page should change.
      item = cb(item);
    }
    return item;
  },

  getTagsAndCategories: function getTagsAndCategories(taxonomies) {
    let data: any = { categories: [], tags: [] };
    taxonomies.forEach(function(taxonomy) {
      if (taxonomy.type === "post_category") {
        data.categories.push(taxonomy);
      } else {
        data.tags.push(taxonomy);
      }
    });
    return data;
  },

  getMetaTags: function getMetaTags(head = {}) {
    let htmlAttrs = "";
    let metaTags = Object.keys(head)
      .map(function(item) {
        if (item == "htmlAttributes") {
          htmlAttrs = head[item].toString();
          return "";
        }
        return head[item].toString();
      })
      .filter(function(x) {
        return x;
      })
      .join("");
    return { htmlAttrs: htmlAttrs, metaTags: metaTags };
  },
  createStringFromProps: function createStringFromProps(props) {
    let string = "";
    Object.keys(props).map(function(key) {
      if (props[key] == "") {
        string += key + " ";
      } else {
        /* eslint-disable quotes*/
        string += key + '="' + props[key] + '" ';
      }
    });
    return string;
  },

  /**
   * data can be an array of objects [{url, defer}, ...]
   * or an array of strings ["url-1","url-2"]
   * or just an object {url}.
   *
   * Prepare this data in a way that it returns
   * <script src="url" {...props}></script>
   */
  prepareScriptTags: function prepareScriptTags(data) {
    let defaults = {
      defer: "",
      type: "text/javascript",
    };
    let createScript = function createScript(params) {
      let props = {};
      if (typeof params === "string") {
        props = { ...defaults, src: params };
      } else {
        props = { ...defaults, ...params, src: params.src };
      }
      let attrs = utils.createStringFromProps(props);
      return "<script " + attrs + "></script>";
    };

    if (Array.isArray(data)) {
      return data.map(createScript).join("");
    }
    return createScript(data);
  },
  /**
   * data can be an array of objects [{href, defer}, ...]
   * or an array of strings ["url-1","url-2"]
   * or just an object {url}.
   *
   * Prepare this data in a way that it returns
   * <script src="url" {...props}></script>
   */
  prepareStyleTags: function prepareStyleTags(data) {
    let defaults = {
      type: "text/css",
      rel: "stylesheet",
    };
    let createScript = function createScript(params) {
      let props = {};
      if (typeof params === "string") {
        props = { ...defaults, href: params };
      } else {
        props = { ...defaults, ...params, href: params };
      }
      let attrs = utils.createStringFromProps(props);
      return "<link " + attrs + "></link>";
    };

    if (Array.isArray(data)) {
      return data.map(createScript).join("");
    }
    return createScript(data);
  },
  convertQueryToParams: function convertQueryToParams(query) {
    if (!query) {
      return {};
    }

    let hashes = query.slice(query.indexOf("?") + 1).split("&");
    let params = {};
    hashes.map(hash => {
      let [key, val] = hash.split("=");
      params[key] = decodeURIComponent(val);
    });

    return params;
  },
  templateEngine: function templateEngine(template, data) {
    if (typeof data !== "object") return template;

    Object.keys(data).map(function(name) {
      let regex = new RegExp("{{" + name + "}}", "g");
      template = template.replace(regex, data[name]);
    });
    return template;
  },
  syncArrays: (
    oldArray: Array<any>,
    newArray: Array<any>,
    key: string,
    compareFields: Array<string>,
  ): { added: Array<any>; deleted: Array<any>; changed: Array<any> } => {
    function mapFromArray(array, prop) {
      let map = {};
      for (let i = 0; i < array.length; i++) {
        map[array[i][prop]] = array[i];
      }
      return map;
    }

    function isEqual(a, b) {
      return (
        compareFields.filter(field => a[field] === b[field]).length ===
        compareFields.length
      );
    }

    function getDelta(o, n, key, comparator) {
      let delta: any = {
        added: [],
        deleted: [],
        changed: [],
      };
      let mapO = mapFromArray(o, key);
      let mapN = mapFromArray(n, key);
      for (let id in mapO) {
        if (!mapN.hasOwnProperty(id)) {
          delta.deleted.push(mapO[id]);
        } else if (!comparator(mapN[id], mapO[id])) {
          delta.changed.push(mapN[id]);
        }
      }

      for (let id in mapN) {
        if (!mapO.hasOwnProperty(id)) {
          delta.added.push(mapN[id]);
        }
      }
      return delta;
    }

    return getDelta(oldArray, newArray, key, isEqual);
  },
};
export default utils;
