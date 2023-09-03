import { ArrayElement } from './array-element';
import {
  handleAuthorErrors,
  handlePostErrors,
  handlePostsErrors,
  handleSettingsErrors,
  handleSitemapErrors,
  handleTagsErrors,
  handleFeedErrors,
} from './errors.js';
import { getSdk, PostFilters, PostsQuery } from './graphql.js';
import { createRequester } from './requester.js';

export interface LetterpadServerOptions {
  url: string;
  token: string;
  host?: string;
}

export interface LetterpadSdkOptions {
  letterpadServer: LetterpadServerOptions;
}

export class Letterpad {
  public sdk: ReturnType<typeof getSdk>;
  constructor(options: LetterpadSdkOptions) {
    this.sdk = getSdk(createRequester(options));
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
      tags?: RawRow['tags'] & { __typename: 'TagsNode' };
    } & { author?: RawRow['author'] & { __typename: 'Author' } };
    return posts as PostsQuery['posts'] & { __typename: 'PostsNode' } & {
      rows: Row[];
    };
  }

  async getPost(slugOrOptions: string | PostFilters) {
    const options =
      typeof slugOrOptions === 'string'
        ? { slug: slugOrOptions }
        : slugOrOptions;
    const postResponse = await this.sdk.post({ filters: options });
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

  async getAuthor() {
    const authorResponse = await this.sdk.me();
    handleAuthorErrors(authorResponse.me);
    return authorResponse.me;
  }

  async getFeed() {
    const feedResponse = await this.sdk.feed();
    handleFeedErrors(feedResponse.feed);
    return feedResponse.feed;
  }
}
