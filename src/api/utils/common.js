import { AllHtmlEntities } from "html-entities";
import config from "../../config";
import fs from "fs";
import path from "path";

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

// We want to convert
// ['tag1, tag2', 'tag3, tag4', 'tag5, tag6']
// to
// [[postId,tag1], [postId,tag2], [postId + 1,tag3], [postId + 1, tag4].....
export function formatTaxonomyForDBInsert(taxonomies, firstInsertID) {
  let result = [];
  taxonomies.map(function(items) {
    console.log(items);
    let taxItems = items.split(",");

    taxItems.forEach(function(taxonomy) {
      result.push([firstInsertID, taxonomy]);
    });
    firstInsertID++;
  });
  return result;
}

export class UnauthorizedError extends Error {
  constructor({ statusCode = 401, url }) {
    super("Unauthorized request to " + url);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends Error {
  constructor({ statusCode = 404, msg }) {
    super("Page not found");
    this.statusCode = statusCode;
  }
}

export const mailTemplate = ({ name, body, footer }) => {
  return `
        <div>
        Hi ${name}, <br/><br/>
            ${body}<br/><br/>
        - Admin<br/>
        </div>
    `;
};

export const getEmailBody = async (templateName, data, models) => {
  // get the template source
  let a = fs;
  let template = fs.readFileSync(
    path.join(__dirname, "../emails/" + templateName + ".html"),
    "utf-8",
  );
  // get the settings data
  const settings = await models.Setting.findAll();
  // format the settings data into an object
  const siteData = {};
  if (settings) {
    settings.forEach(setting => {
      siteData[setting.option] = setting.value;
    });
  }
  // do some default replacements
  const blogname = siteData.site_title;
  const blogurl = config.BASE_NAME;
  const loginurl = blogurl + "admin/login";

  template = template.replaceAll("{{blogurl}}", blogurl);
  template = template.replaceAll("{{blogname}}", blogname);
  template = template.replaceAll("{{loginurl}}", loginurl);

  Object.keys(data).forEach(variable => {
    template = template.replaceAll("{{" + variable + "}}", data[variable]);
  });
  return template;
};

// Quick and dirty way of getting the text representation of a string of HTML,
// basically close to what a DOM node's innerText property would be
export function innertext(html) {
  const entities = new AllHtmlEntities();
  // Drop everything inside <...> (i.e., tags/elements), and keep the text.
  // Unlike browser innerText, this removes newlines; it also doesn't handle
  // un-encoded `<` or `>` characters very well, so don't feed it malformed HTML
  return entities.decode(
    html
      .split(/<[^>]+>/)
      .map(function(chunk) {
        return chunk.trim();
      })
      .filter(function(trimmedChunk) {
        return trimmedChunk.length > 0;
      })
      .join(" "),
  );
}
