import { GraphQLClient } from "graphql-request";
import { ArrayElement } from "./array-element";
import {
  handleAuthorErrors,
  handlePostErrors,
  handlePostsErrors,
  handleSettingsErrors,
  handleSitemapErrors,
  handleTagsErrors,
} from "./errors.js";
import { getSdk, PostsQuery } from "./graphql.js";

export interface LetterpadServerOptions {
  url: string;
  token: string;
}

export interface LetterpadSdkOptions {
  letterpadServer: LetterpadServerOptions;
}

export class Letterpad {
  public client: GraphQLClient;
  public sdk: ReturnType<typeof getSdk>;
  constructor(options: LetterpadSdkOptions) {
    this.client = new GraphQLClient(options.letterpadServer.url, {
      headers: {
        authorization: `Bearer ${options.letterpadServer.token}`,
      },
    });
    this.sdk = getSdk(this.client);
  }

  async listPosts(tagSlug?: string) {
    const postResult = await this.sdk.posts({
      tagSlug,
    });
    const posts = postResult.posts;

    handlePostsErrors(posts);
    for (const row of posts.rows) {
      handleTagsErrors(row.tags);
      handleAuthorErrors(row.author);
    }

    type RawRow = ArrayElement<typeof posts.rows>;
    type Row = RawRow & {
      tags?: RawRow["tags"] & { __typename: "TagsNode" };
    } & { author?: RawRow["author"] & { __typename: "Author" } };

    return posts as PostsQuery["posts"] & { __typename: "PostsNode" } & {
      rows: Row[];
    };
  }

  async getPost(slug: string) {
    const postResponse = await this.sdk.post({ slug });
    handlePostErrors(postResponse.post);
    handleTagsErrors(postResponse.post.tags);
    handleAuthorErrors(postResponse.post.author);
    return postResponse.post;
  }

  async listTags() {
    const tagsResponse = await this.sdk.tags();
    handleTagsErrors(tagsResponse.tags);
    return tagsResponse.tags;
  }

  async getSitemap() {
    const sitemapResponse = await this.sdk.sitemap();
    handleSitemapErrors(sitemapResponse.sitemap);
    return sitemapResponse.sitemap;
  }

  async getSettings() {
    const settingsResponse = await this.sdk.settings();
    handleSettingsErrors(settingsResponse.settings);
    return settingsResponse.settings;
  }
}
