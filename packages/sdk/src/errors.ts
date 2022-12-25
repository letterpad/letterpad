// Base Error class for all known letterpad errors
class LetterpadError extends Error {}

/**
 * User Error
 */
export class LetterpadUserError extends LetterpadError {}

/**
 * User errors
 */

export class LetterpadNotFoundError extends LetterpadUserError {}

export class LetterpadUnauthorizedError extends LetterpadUserError {}

export class LetterpadInvalidArgumentsError extends LetterpadUserError {}

/**
 * Server Errors
 */

export class LetterpadException extends LetterpadError {}

export class LetterpadSitemapError extends LetterpadError {}

export class LetterpadTagsError extends LetterpadError {}

export function handleAuthorErrors(author?: {
  __typename?: string;
  message?: string;
}): asserts author is { __typename: "Author" } {
  switch (author?.__typename) {
    case "Exception":
    case "Failed":
      throw new LetterpadException(author.message);
    case "NotFound":
      throw new LetterpadNotFoundError(author.message);
    case "UnAuthorized":
      throw new LetterpadUnauthorizedError(author.message);
  }
}

export function handleTagsErrors(tagsNode?: {
  __typename?: string;
  message?: string;
}): asserts tagsNode is { __typename: "TagsNode" } {
  switch (tagsNode?.__typename) {
    case "Exception":
      throw new LetterpadException(tagsNode.message);
    case "TagsError":
      throw new LetterpadTagsError(tagsNode.message);
  }
}

export function handlePostsErrors(postsNode: {
  __typename?: string;
  message?: string;
}): asserts postsNode is { __typename: "PostsNode" } {
  switch (postsNode.__typename) {
    case "Exception":
      throw new LetterpadException(postsNode.message);
    case "UnAuthorized":
      throw new LetterpadUnauthorizedError(postsNode.message);
  }
}

export function handlePostErrors(post: {
  __typename?: string;
  message?: string;
}): asserts post is { __typename: "Post" } {
  switch (post.__typename) {
    case "Exception":
      throw new LetterpadException(post.message);
    case "InvalidArguments":
      throw new LetterpadInvalidArgumentsError(post.message);
    case "NotFound":
      throw new LetterpadNotFoundError(post.message);
    case "UnAuthorized":
      throw new LetterpadUnauthorizedError(post.message);
  }
}

export function handleSitemapErrors(sitemap: {
  __typename?: string;
  message?: string;
}): asserts sitemap is { __typename: "SiteMapList" } {
  switch (sitemap.__typename) {
    case "SiteMapError":
      throw new LetterpadSitemapError(sitemap.message);
  }
}

export function handleSettingsErrors(settings: {
  __typename?: string;
  message?: string;
}): asserts settings is { __typename: "Setting" } {
  switch (settings.__typename) {
    case "NotFound":
      throw new LetterpadNotFoundError(settings.message);
    case "UnAuthorized":
      throw new LetterpadUnauthorizedError(settings.message);
  }
}

export function handleFeedErrors(feed: {
  __typename?: string;
  message?: string;
}): asserts feed is { __typename: "Feed" } {
  switch (feed.__typename) {
    case "FeedError":
      throw new LetterpadNotFoundError(feed.message);
  }
}
