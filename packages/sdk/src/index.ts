import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql.js";

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
    const postResult = await this.sdk.postsQuery({
      tagSlug,
    });

    if (postResult.posts.__typename != "PostsNode") {
      throw new Error("error fetching posts: " + postResult.posts.message);
    }
    for (const row of postResult.posts.rows) {
      if (row.tags && row.tags.__typename != "TagsNode") {
        throw new Error("error fetching tags: " + row.tags.message);
      }
      if (row.author && row.author.__typename !== "Author") {
        throw new Error("error fetching author: " + row.author.message);
      }
    }
    return postResult;
  }

  async getPost(slug: string) {
    return this.sdk.PageQuery({
      slug,
    });
  }

  async getSitemap() {
    return this.sdk.SitemapQuery();
  }
}
