import { IImportExportData } from "@/components/import-export/importExportTypes";
import { PostStatusOptions, PostTypes } from "../../../__generated__/__types__";
import AjvFormats from "ajv-formats";
import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({ removeAdditional: true, strictTypes: false });

AjvFormats(ajv);
ajv.addFormat("custom-date-time", function (dateTimeString) {
  if (
    typeof dateTimeString === "string" ||
    typeof dateTimeString === "object"
  ) {
    return new Date(dateTimeString).toString() !== "Invalid Date";
  }
  if (dateTimeString === null) {
    return true;
  }
  return false;
});

ajv.addFormat("below-current-date-time", function (dateTimeString) {
  const today = new Date();
  if (
    typeof dateTimeString === "string" ||
    typeof dateTimeString === "object"
  ) {
    const inputDate = new Date(dateTimeString);
    return inputDate.getTime() < today.getTime();
  }
  if (dateTimeString === null) {
    return true;
  }
  return false;
});

//@ts-ignore
export const schema: JSONSchemaType<IImportExportData> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    authors: {
      type: "object",
      additionalProperties: false,
      patternProperties: {
        "^[a-zA-Z0-9@._]+$": {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
            },
            username: {
              type: "string",
            },
            email: {
              type: "string",
            },
            bio: {
              type: "string",
            },
            avatar: {
              type: "string",
            },
            social: {
              type: "string",
            },
            verified: {
              type: "boolean",
            },
            createdAt: {
              type: ["string", "object"],
              format: "custom-date-time",
            },
            updatedAt: {
              type: ["string", "object"],
              format: "custom-date-time",
            },
            posts: {
              required: [
                "title",
                "html",
                "html_draft",
                "excerpt",
                "cover_image",
                "cover_image_width",
                "cover_image_height",
                "type",
                "featured",
                "status",
                "slug",
                "reading_time",
                "publishedAt",
                "scheduledAt",
                "updatedAt",
                "createdAt",
                "tags",
              ],
              type: "array",
              items: {
                additionalProperties: false,
                properties: {
                  title: {
                    type: "string",
                  },
                  html: {
                    type: "string",
                  },
                  html_draft: {
                    type: "string",
                  },
                  excerpt: {
                    type: "string",
                  },
                  cover_image: {
                    type: "string",
                  },
                  cover_image_width: {
                    type: "integer",
                  },
                  cover_image_height: {
                    type: "integer",
                  },
                  type: {
                    enum: Object.values(PostTypes),
                  },
                  featured: {
                    type: "boolean",
                  },
                  status: {
                    enum: Object.values(PostStatusOptions),
                  },
                  slug: {
                    type: "string",
                  },
                  reading_time: {
                    type: "string",
                  },
                  publishedAt: {
                    type: ["string", "object", "null"],
                    format: "below-current-date-time",
                  },
                  scheduledAt: {
                    type: ["string", "object", "null"],
                    format: "custom-date-time",
                  },
                  updatedAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                  createdAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        name: {
                          type: "string",
                        },
                        desc: {
                          type: "string",
                        },
                        slug: {
                          type: "string",
                        },
                        createdAt: {
                          type: ["string", "object"],
                          format: "below-current-date-time",
                        },
                        updatedAt: {
                          type: ["string", "object"],
                          format: "below-current-date-time",
                        },
                      },
                      required: [
                        "name",
                        "desc",
                        "slug",
                        "createdAt",
                        "updatedAt",
                      ],
                    },
                  },
                },
              },
            },
            setting: {
              type: "object",
              additionalProperties: false,
              properties: {
                site_title: {
                  type: "string",
                },
                site_tagline: {
                  type: "string",
                },
                site_email: {
                  type: "string",
                },
                site_url: {
                  type: "string",
                },
                site_footer: {
                  type: "string",
                },
                site_description: {
                  type: "string",
                },
                subscribe_embed: {
                  type: "string",
                },
                social_twitter: {
                  type: "string",
                },
                social_facebook: {
                  type: "string",
                },
                social_instagram: {
                  type: "string",
                },
                social_github: {
                  type: "string",
                },
                display_author_info: {
                  type: "boolean",
                },
                cloudinary_key: {
                  type: "string",
                },
                cloudinary_name: {
                  type: "string",
                },
                cloudinary_secret: {
                  type: "string",
                },
                menu: {
                  type: "string",
                },
                css: {
                  type: "string",
                },
                google_analytics: {
                  type: "string",
                },
                theme: {
                  type: "string",
                },
                banner: {
                  type: "string",
                },
                site_logo: {
                  type: "string",
                },
                site_favicon: {
                  type: "string",
                },
                createdAt: {
                  type: ["string", "object", "null"],
                  format: "below-current-date-time",
                },
                updatedAt: {
                  type: ["string", "object", "null"],
                  format: "below-current-date-time",
                },
                graphcomment_id: {
                  type: "string",
                },
                intro_dismissed: {
                  type: "boolean",
                },
              },
              required: [
                "site_title",
                "site_tagline",
                "site_email",
                "site_url",
                "site_footer",
                "site_description",
                "subscribe_embed",
                "social_twitter",
                "social_facebook",
                "social_instagram",
                "social_github",
                "display_author_info",
                "cloudinary_key",
                "cloudinary_name",
                "cloudinary_secret",
                "menu",
                "css",
                "google_analytics",
                "theme",
                "banner",
                "site_logo",
                "site_favicon",
                "createdAt",
                "updatedAt",
                "graphcomment_id",
                "intro_dismissed",
              ],
            },
            subscribers: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  verified: {
                    type: "boolean",
                  },
                  createdAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                  updatedAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                },
                required: ["email", "createdAt", "updatedAt", "verified"],
              },
            },
            uploads: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: {
                    type: "string",
                  },
                  height: {
                    type: "integer",
                  },
                  width: {
                    type: "integer",
                  },
                  url: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  createdAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                  updatedAt: {
                    type: ["string", "object"],
                    format: "below-current-date-time",
                  },
                },
                required: [
                  "name",
                  "url",
                  "width",
                  "height",
                  "description",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          },
          required: [
            "name",
            "username",
            "email",
            "bio",
            "avatar",
            "social",
            "verified",
            "createdAt",
            "updatedAt",
            "posts",
            "setting",
            "subscribers",
            "uploads",
          ],
        },
      },
    },
  },
  required: ["authors"],
};

const validate = ajv.compile(schema);

export const validateWithAjv = (data) => {
  const valid = validate(data);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  return data;
};
