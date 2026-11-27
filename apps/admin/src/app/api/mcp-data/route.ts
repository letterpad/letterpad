import { Prisma } from "@prisma/client";
import { imageSize } from "image-size";
import { PostStatusOptions, PostTypes, Role } from "letterpad-graphql";
import { revalidateTag } from "next/cache";

import { getMcpWriter } from "@/lib/mcpTokens";
import { prisma } from "@/lib/prisma";
import { storeMediaUpload } from "@/lib/storeMediaUpload";

import { getSocialLink } from "@/graphql/resolvers/helpers";
import { createPost } from "@/graphql/services/post/createPost";
import { updatePost } from "@/graphql/services/post/updatePost";
import { updateSetting } from "@/graphql/services/setting/updateSetting";
import { IMediaUploadResult } from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import logger from "@/shared/logger";
import { textToSlug } from "@/utils/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MAX_BODY_TEXT = 60_000;
const MAX_RETURNED_HTML = 60_000;
const TOPIC_PREFIX = "_topic_";
const TOPIC_CATEGORIES = new Set([
  "health-&-wellness", "technology", "travel-&-adventure", "entertainment",
  "business-&-finance", "food-&-cooking", "personal-development", "science",
  "sports", "art-&-creativity", "fashion", "environment", "education",
  "philosophy", "social-media", "programming", "gaming", "photography",
  "literature", "music", "film", "design", "entrepreneurship", "mindfulness",
  "psychology", "sustainability", "history", "astronomy", "fitness", "diy-crafts",
]);
const ALLOWED_IMAGES: Record<string, string> = {
  jpg: "jpg",
  png: "png",
  webp: "webp",
  gif: "gif",
};

const publishedArticle = {
  status: PostStatusOptions.Published,
  type: PostTypes.Post,
  banned: false,
};
const articleMetadata = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  tags: { select: { name: true } },
  author: {
    select: {
      name: true,
      username: true,
      setting: { select: { site_url: true } },
    },
  },
} as const;

const blogSettings = {
  site_title: true,
  site_tagline: true,
  site_description: true,
} as const;

const profileSelect = {
  username: true,
  name: true,
  bio: true,
  occupation: true,
  company_name: true,
  signature: true,
  avatar: true,
  social: true,
} satisfies Prisma.AuthorSelect;

const profileTextLimits = {
  name: 100,
  bio: 4000,
  occupation: 100,
  company_name: 100,
  signature: 400,
} as const;
const socialFields = [
  "twitter",
  "facebook",
  "instagram",
  "github",
  "linkedin",
] as const;

type Profile = Prisma.AuthorGetPayload<{ select: typeof profileSelect }>;
type ProfileSocial = Partial<Record<(typeof socialFields)[number], string>>;

class RequestError extends Error {
  constructor(
    message: string,
    readonly status = 400
  ) {
    super(message);
  }
}

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function failure(error: unknown) {
  if (error instanceof RequestError) {
    return reply({ error: error.message }, error.status);
  }
  logger.error(error);
  return reply({ error: "Letterpad could not complete the request." }, 500);
}

async function getWriter(request: Request) {
  const authorId = await getMcpWriter(request.headers.get("authorization"));
  if (!authorId) {
    throw new RequestError("A valid Letterpad MCP token is required.", 401);
  }
  return authorId;
}

async function readBody(request: Request, maxBytes: number) {
  if (
    !request.body ||
    Number(request.headers.get("content-length")) > maxBytes
  ) {
    throw new RequestError("Request body is missing or too large.", 413);
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (
    let result = await reader.read();
    !result.done;
    result = await reader.read()
  ) {
    length += result.value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw new RequestError("Request body is too large.", 413);
    }
    chunks.push(result.value);
  }
  return Buffer.concat(chunks, length);
}

async function readInput(request: Request): Promise<Record<string, unknown>> {
  const raw = await readBody(request, MAX_BODY_BYTES);
  let body: unknown;
  try {
    body = JSON.parse(raw.toString("utf8"));
  } catch {
    throw new RequestError("Expected a JSON object.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestError("Expected a JSON object.");
  }
  return body as Record<string, unknown>;
}

function textField(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || value.length > max || !value.trim()) {
    throw new RequestError(
      `${label} must contain between 1 and ${max} characters.`
    );
  }
  return value.trim();
}

function canonicalUrl(siteUrl: string | undefined, slug: string) {
  if (!siteUrl || !slug) return null;
  try {
    const url = new URL(siteUrl);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return null;
    url.pathname =
      url.pathname.replace(/\/+$/, "") + "/post/" + encodeURIComponent(slug);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function articleResponse(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | null;
  tags: { name: string }[];
  author: {
    name: string | null;
    username: string | null;
    setting: { site_url: string } | null;
  } | null;
}) {
  const { author, tags, ...data } = post;
  return {
    ...data,
    tags: tags.map((tag) => tag.name).filter((name) => !name.startsWith(TOPIC_PREFIX)),
    categories: tags
      .map((tag) => tag.name)
      .filter((name) => name.startsWith(TOPIC_PREFIX))
      .map((name) => name.slice(TOPIC_PREFIX.length)),
    author: author ? { name: author.name, username: author.username } : null,
    url: canonicalUrl(author?.setting?.site_url, post.slug),
  };
}

function readPage(query: URLSearchParams) {
  const limit = Number(query.get("limit") ?? 10);
  const offset = Number(query.get("offset") ?? 0);
  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 25 ||
    !Number.isInteger(offset) ||
    offset < 0 ||
    offset > 1000
  ) {
    throw new RequestError(
      "Use a limit from 1 to 25 and an offset from 0 to 1000."
    );
  }
  return { limit, offset };
}

function nextOffset(count: number, limit: number, offset: number) {
  return count > limit && offset + limit <= 1000 ? offset + limit : null;
}

function editableDrafts(authorId: string) {
  return {
    author_id: authorId,
    status: PostStatusOptions.Draft,
    type: PostTypes.Post,
    banned: false,
  };
}

const draftMetadata = {
  id: true,
  title: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  tags: { select: { name: true } },
} as const;

function htmlResponse(html: string) {
  return {
    html: html.slice(0, MAX_RETURNED_HTML),
    truncated: html.length > MAX_RETURNED_HTML,
  };
}

async function readDrafts(
  request: Request,
  query: URLSearchParams,
  op: string
) {
  const authorId = await getWriter(request);
  const where = editableDrafts(authorId);
  if (op === "get-draft") {
    const draft = await prisma.post.findFirst({
      where: { ...where, id: textField(query.get("id"), "id", 100) },
      select: { ...draftMetadata, html_draft: true },
    });
    if (!draft) throw new RequestError("Draft not found.", 404);
    const { html_draft, tags, ...metadata } = draft;
    return reply({
      ...metadata,
      tags: tags.map((tag) => tag.name).filter((name) => !name.startsWith(TOPIC_PREFIX)),
      categories: tags
        .map((tag) => tag.name)
        .filter((name) => name.startsWith(TOPIC_PREFIX))
        .map((name) => name.slice(TOPIC_PREFIX.length)),
      ...htmlResponse(html_draft ?? ""),
    });
  }

  const { limit, offset } = readPage(query);
  const drafts = await prisma.post.findMany({
    where,
    select: draftMetadata,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    skip: offset,
    take: limit + 1,
  });
  return reply({
    drafts: drafts.slice(0, limit).map(({ tags, ...draft }) => ({
      ...draft,
      tags: tags.map((tag) => tag.name).filter((name) => !name.startsWith(TOPIC_PREFIX)),
      categories: tags
        .map((tag) => tag.name)
        .filter((name) => name.startsWith(TOPIC_PREFIX))
        .map((name) => name.slice(TOPIC_PREFIX.length)),
    })),
    nextOffset: nextOffset(drafts.length, limit, offset),
  });
}

async function readMyPosts(
  request: Request,
  query: URLSearchParams,
  op: string
) {
  const authorId = await getWriter(request);
  const where = { ...publishedArticle, author_id: authorId };
  if (op === "get-my-post") {
    const post = await prisma.post.findFirst({
      where: { ...where, id: textField(query.get("id"), "id", 100) },
      select: { ...articleMetadata, html: true },
    });
    if (!post) throw new RequestError("Published post not found.", 404);
    const { html, ...metadata } = post;
    return reply({ ...articleResponse(metadata), ...htmlResponse(html) });
  }

  const { limit, offset } = readPage(query);
  const posts = await prisma.post.findMany({
    where,
    select: articleMetadata,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    skip: offset,
    take: limit + 1,
  });
  return reply({
    posts: posts.slice(0, limit).map(articleResponse),
    nextOffset: nextOffset(posts.length, limit, offset),
  });
}

async function readBlogSettings(request: Request) {
  const authorId = await getWriter(request);
  const settings = await prisma.setting.findUnique({
    where: { author_id: authorId },
    select: blogSettings,
  });
  if (!settings) throw new RequestError("Blog settings not found.", 404);
  return reply(settings);
}

async function updateBlogSettings(
  authorId: string,
  input: Record<string, unknown>
) {
  if (
    Object.keys(input).some(
      (key) => key !== "op" && !Object.hasOwn(blogSettings, key)
    )
  ) {
    throw new RequestError(
      "Only site title, tagline, and description can be changed."
    );
  }

  const { site_title, site_tagline, site_description } = input;
  const changes: Partial<Record<keyof typeof blogSettings, string>> = {};
  if (site_title !== undefined)
    changes.site_title = textField(site_title, "site_title", 30);
  if (site_tagline !== undefined)
    changes.site_tagline = textField(site_tagline, "site_tagline", 60);
  if (site_description !== undefined) {
    if (typeof site_description !== "string" || site_description.length > 190) {
      throw new RequestError(
        "site_description must be at most 190 characters."
      );
    }
    changes.site_description = site_description.trim();
  }
  if (!Object.keys(changes).length) {
    throw new RequestError("Provide at least one setting to update.");
  }

  const settings = await updateSetting(
    { options: [changes] },
    { prisma, session: { user: { id: authorId } } }
  );
  if (settings.__typename === "NotFound") {
    throw new RequestError("Blog settings not found.", 404);
  }
  if (settings.__typename !== "Setting") {
    throw new Error("Could not update blog settings.");
  }
  return reply({
    site_title: settings.site_title,
    site_tagline: settings.site_tagline,
    site_description: settings.site_description,
  });
}

function parseProfileSocial(value: string): ProfileSocial {
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      const data = parsed as Record<string, unknown>;
      const social: ProfileSocial = {};
      for (const field of socialFields) {
        const entry = data[field];
        if (typeof entry === "string") social[field] = entry;
      }
      return social;
    }
  } catch {
    // Older profiles can have an empty or malformed social field.
  }
  return {};
}

function profileResponse({ avatar, bio, social, ...profile }: Profile) {
  return reply({
    ...profile,
    bio_html: bio ?? "",
    avatar_url: avatar?.startsWith("/")
      ? getRootUrl().replace(/\/$/, "") + avatar
      : (avatar ?? ""),
    social: getSocialLink(parseProfileSocial(social)),
  });
}

async function readProfile(request: Request) {
  const authorId = await getWriter(request);
  const profile = await prisma.author.findUnique({
    where: { id: authorId },
    select: profileSelect,
  });
  if (!profile) throw new RequestError("Profile not found.", 404);
  return profileResponse(profile);
}

function profileText(value: unknown, field: keyof typeof profileTextLimits) {
  const max = profileTextLimits[field];
  if (field === "name") return textField(value, field, max);
  if (typeof value !== "string" || value.length > max) {
    throw new RequestError(`${field} must be at most ${max} characters.`);
  }
  return value.trim();
}

function socialValue(value: unknown, field: string) {
  if (typeof value === "string" && value.length <= 255) {
    const entry = value.trim();
    const handle = entry.replace(/^@/, "");
    if (!entry || /^[a-zA-Z0-9_.-]+$/.test(handle)) return handle;
    if (entry.startsWith("https://")) {
      try {
        const url = new URL(entry);
        if (!url.username && !url.password) return url.href;
      } catch {
        // Return the validation error below.
      }
    }
  }
  throw new RequestError(
    `social.${field} must be a handle, an HTTPS URL, or an empty string.`
  );
}

async function updateProfile(authorId: string, input: Record<string, unknown>) {
  if (
    Object.keys(input).some(
      (field) =>
        field !== "op" &&
        field !== "avatar_url" &&
        field !== "social" &&
        !Object.hasOwn(profileTextLimits, field)
    )
  ) {
    throw new RequestError(
      "Only the supported public profile fields can be changed."
    );
  }

  const data: Prisma.AuthorUpdateInput = {};
  for (const field of Object.keys(
    profileTextLimits
  ) as (keyof typeof profileTextLimits)[]) {
    if (input[field] === undefined) continue;
    const value = profileText(input[field], field);
    data[field] = field === "bio" && value ? plainTextToHtml(value) : value;
  }

  if (input.avatar_url !== undefined) {
    data.avatar =
      input.avatar_url === ""
        ? ""
        : (await findOwnedImage(authorId, input.avatar_url, "avatar_url")).src;
  }

  const where: Prisma.AuthorWhereUniqueInput = { id: authorId };
  if (input.social !== undefined) {
    if (
      !input.social ||
      typeof input.social !== "object" ||
      Array.isArray(input.social)
    ) {
      throw new RequestError(
        "social must be an object of supported social links."
      );
    }
    const changes: ProfileSocial = {};
    for (const [field, value] of Object.entries(input.social)) {
      const key = socialFields.find((item) => item === field);
      if (!key) throw new RequestError(`Unsupported social link: ${field}.`);
      changes[key] = socialValue(value, key);
    }
    if (Object.keys(changes).length) {
      const profile = await prisma.author.findUnique({
        where: { id: authorId },
        select: { social: true },
      });
      if (!profile) throw new RequestError("Profile not found.", 404);
      where.social = profile.social;
      const social = JSON.stringify({
        ...parseProfileSocial(profile.social),
        ...changes,
      });
      if (social.length > 500) {
        throw new RequestError(
          "The combined social links are too long. Use handles or shorter URLs."
        );
      }
      data.social = social;
    }
  }

  if (!Object.keys(data).length) {
    throw new RequestError(
      "Provide at least one public profile field to update."
    );
  }
  try {
    const profile = await prisma.author.update({
      where,
      data,
      select: profileSelect,
    });
    revalidateTag("letterpadLatestPosts");
    revalidateTag("featuredPosts");
    revalidateTag("trendingPosts");
    revalidateTag("newAuthors");
    return profileResponse(profile);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      if (where.social !== undefined) {
        throw new RequestError(
          "The social links changed. Read your profile and retry.",
          409
        );
      }
      throw new RequestError("Profile not found.", 404);
    }
    throw error;
  }
}

export async function GET(request: Request) {
  if (process.env.LETTERPAD_MCP_ENABLED !== "true")
    return reply({ error: "Not found." }, 404);
  try {
    const query = new URL(request.url).searchParams;
    const op = query.get("op");
    if (op === "get-profile") return await readProfile(request);
    if (op === "get-settings") return await readBlogSettings(request);
    if (op === "list-my-posts" || op === "get-my-post") {
      return await readMyPosts(request, query, op);
    }
    if (op === "list-drafts" || op === "get-draft") {
      return await readDrafts(request, query, op);
    }
    throw new RequestError("Unknown MCP read operation.");
  } catch (error) {
    return failure(error);
  }
}

function plainTextToHtml(text: string) {
  const escape = (line: string) =>
    line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escape(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function postTags(
  existing: { name: string }[],
  input: Record<string, unknown>
) {
  let regular = existing
    .map(({ name }) => name)
    .filter((name) => !name.startsWith(TOPIC_PREFIX));
  let topics = existing
    .map(({ name }) => name)
    .filter((name) => name.startsWith(TOPIC_PREFIX));

  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags) || input.tags.length > 20) {
      throw new RequestError("tags must contain at most 20 tag names.");
    }
    regular = input.tags.map((raw) => {
      const name = typeof raw === "string" ? textToSlug(raw.trim()) : "";
      if (!name || name.startsWith(TOPIC_PREFIX) || name.length > 50) {
        throw new RequestError("Each tag must be a valid name of at most 50 characters.");
      }
      return name;
    });
  }

  if (input.categories !== undefined) {
    if (
      !Array.isArray(input.categories) ||
      input.categories.length > 1 ||
      input.categories.some(
        (category) => typeof category !== "string" || !TOPIC_CATEGORIES.has(category)
      )
    ) {
      throw new RequestError(
        "categories must be an empty array or one supported Letterpad topic."
      );
    }
    topics = input.categories.map((category) => `${TOPIC_PREFIX}${category}`);
  }

  return [...new Set([...regular, ...topics])].map((name) => ({ name, slug: name }));
}

async function updateOwnedPost(
  authorId: string,
  input: Record<string, unknown>,
  status: PostStatusOptions
) {
  const id = textField(input.id, "id", 100);
  const post = await prisma.post.findFirst({
    where: {
      author_id: authorId,
      id,
      type: PostTypes.Post,
      banned: false,
      status,
    },
    select: { id: true, status: true, tags: { select: { name: true } } },
  });
  if (!post) {
    throw new RequestError(
      status === PostStatusOptions.Published
        ? "Published post not found."
        : "Editable draft not found.",
      404
    );
  }

  const data: Record<string, unknown> = { id };
  if (input.title !== undefined) data.title = textField(input.title, "title", 190);
  if (input.body !== undefined) {
    data.html_draft = plainTextToHtml(textField(input.body, "body", MAX_BODY_TEXT));
  }
  if (input.cover_image_url !== undefined) {
    const cover = await findCover(authorId, input.cover_image_url);
    data.cover_image = cover;
  }
  if (input.tags !== undefined || input.categories !== undefined) {
    data.tags = postTags(post.tags, input);
  }
  if (Object.keys(data).length === 1) {
    throw new RequestError("Supply a title, body, cover image, tags, or categories to update.");
  }

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    select: { username: true, avatar: true, role: { select: { name: true } } },
  });
  if (!author) throw new RequestError("Letterpad author not found.", 404);
  const result = await updatePost(
    { data: data as Parameters<typeof updatePost>[0]["data"] },
    {
      prisma,
      session: {
        user: {
          id: authorId,
          username: author.username ?? "",
          avatar: author.avatar ?? "",
          role: author.role?.name ?? Role.Author,
        },
      },
    } as Parameters<typeof updatePost>[1]
  );
  if (result.__typename === "PostError")
    throw new RequestError(result.message, 400);
  if (result.__typename !== "Post")
    throw new RequestError("Letterpad could not update the post.", 400);
  return reply({
    id,
    title: result.title,
    slug: result.slug,
    status: status.toLowerCase(),
  });
}

async function findOwnedImage(
  authorId: string,
  value: unknown,
  field: "cover_image_url" | "avatar_url"
) {
  const url = textField(value, field, 255);
  let relative: string | undefined;
  try {
    const absolute = new URL(url);
    if (
      !["https:", "http:"].includes(absolute.protocol) ||
      absolute.username ||
      absolute.password
    ) {
      throw new RequestError("Use the URL returned by upload_image.");
    }
    if (
      absolute.origin === new URL(getRootUrl()).origin &&
      !absolute.search &&
      !absolute.hash
    ) {
      relative = absolute.pathname;
    }
  } catch {
    // An absolute URL is returned by upload_image.
    throw new RequestError("Use the URL returned by upload_image.");
  }
  const image = await prisma.upload.findFirst({
    where: {
      author_id: authorId,
      url: { in: relative ? [url, relative] : [url] },
    },
    select: { url: true, width: true, height: true },
  });
  if (!image)
    throw new RequestError(
      field === "avatar_url"
        ? "Avatar not found in your media library."
        : "Cover image not found in your media library.",
      404
    );
  return { src: image.url, width: image.width, height: image.height };
}

function findCover(authorId: string, value: unknown) {
  return value === undefined
    ? undefined
    : findOwnedImage(authorId, value, "cover_image_url");
}

async function uploadImage(authorId: string, input: Record<string, unknown>) {
  const encoded = textField(
    input.base64,
    "base64",
    Math.ceil(MAX_IMAGE_BYTES / 3) * 4
  );
  if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new RequestError("Send standard base64 without a data URL prefix.");
  }
  const buffer = Buffer.from(encoded, "base64");
  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    throw new RequestError("Images must be 4 MiB or smaller.", 413);
  }
  if (buffer.toString("base64") !== encoded) {
    throw new RequestError("Send valid base64 image data.");
  }
  return saveImage(authorId, buffer, input.filename);
}

async function saveImage(
  authorId: string,
  buffer: Buffer,
  rawFilename: unknown
) {
  let size: ReturnType<typeof imageSize>;
  try {
    size = imageSize(buffer);
  } catch {
    throw new RequestError("Expected a JPEG, PNG, WebP, or GIF image.");
  }
  const extension =
    size.type && Object.hasOwn(ALLOWED_IMAGES, size.type)
      ? ALLOWED_IMAGES[size.type]
      : null;
  if (
    !extension ||
    !size.width ||
    !size.height ||
    size.width * size.height > 24_000_000
  ) {
    throw new RequestError(
      "Expected a JPEG, PNG, WebP, or GIF image of at most 24 megapixels."
    );
  }
  const label = textField(rawFilename, "filename", 140).replace(/\.[^.]*$/, "");
  const filename =
    (label.replace(/[^a-zA-Z0-9_-]/g, "-") || "image") + "." + extension;
  let media: IMediaUploadResult;
  try {
    media = await storeMediaUpload(
      authorId,
      {
        buffer,
        originalname: filename,
      },
      { requireCloudinary: true }
    );
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "error" in error
          ? String(error.error)
          : "Unknown storage error";
    logger.error("MCP image storage failed", detail);
    throw new RequestError(
      `Image storage failed: ${detail.slice(0, 240)}`,
      502
    );
  }
  return reply(
    {
      url: new URL(media.src, getRootUrl()).toString(),
      width: media.size.width,
      height: media.size.height,
    },
    201
  );
}

async function publishDraft(authorId: string, input: Record<string, unknown>) {
  const id = textField(input.id, "id", 100);
  const post = await prisma.post.findFirst({
    where: {
      author_id: authorId,
      id,
      type: PostTypes.Post,
      banned: false,
      status: { in: [PostStatusOptions.Draft, PostStatusOptions.Published] },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      author: { select: { setting: { select: { site_url: true } } } },
    },
  });
  if (!post) throw new RequestError("Your draft was not found.", 404);
  if (post.status === PostStatusOptions.Published) {
    return reply({
      id: post.id,
      title: post.title,
      slug: post.slug,
      url: canonicalUrl(post.author?.setting?.site_url, post.slug),
      status: "published",
    });
  }

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    select: {
      username: true,
      avatar: true,
      role: { select: { name: true } },
    },
  });
  if (!author) throw new RequestError("Letterpad author not found.", 404);

  const result = await updatePost(
    { data: { id: post.id, status: PostStatusOptions.Published } },
    {
      prisma,
      session: {
        user: {
          id: authorId,
          username: author.username ?? "",
          avatar: author.avatar ?? "",
          role: author.role?.name ?? Role.Author,
        },
      },
    } as Parameters<typeof updatePost>[1]
  );
  if (result.__typename === "PostError") {
    throw new RequestError(result.message, 400);
  }
  if (result.__typename !== "Post") {
    throw new RequestError("Letterpad could not publish your draft.", 400);
  }
  return reply({
    id: result.id,
    title: result.title,
    slug: result.slug,
    url: canonicalUrl(post.author?.setting?.site_url, result.slug),
    status: "published",
  });
}

export async function PUT(request: Request) {
  if (process.env.LETTERPAD_MCP_ENABLED !== "true")
    return reply({ error: "Not found." }, 404);
  try {
    const authorId = await getWriter(request);
    if (request.headers.get("content-type") !== "application/octet-stream") {
      throw new RequestError(
        "Send the image as application/octet-stream.",
        415
      );
    }
    const filename = request.headers.get("x-letterpad-filename");
    const file = await readBody(request, MAX_IMAGE_BYTES);
    return await saveImage(authorId, file, filename);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (process.env.LETTERPAD_MCP_ENABLED !== "true")
    return reply({ error: "Not found." }, 404);
  try {
    const authorId = await getWriter(request);
    const input = await readInput(request);
    if (input.op === "update-profile")
      return await updateProfile(authorId, input);
    if (input.op === "upload") return await uploadImage(authorId, input);
    if (input.op === "update-settings")
      return await updateBlogSettings(authorId, input);
    if (input.op === "publish") return await publishDraft(authorId, input);
    if (input.op === "update-post") {
      return await updateOwnedPost(authorId, input, PostStatusOptions.Published);
    }
    if (input.op !== "create" && input.op !== "update") {
      throw new RequestError("Unknown draft operation.");
    }

    const title =
      input.op === "create" || input.title !== undefined
        ? textField(input.title, "title", 190)
        : undefined;
    const body =
      input.op === "create" || input.body !== undefined
        ? plainTextToHtml(textField(input.body, "body", MAX_BODY_TEXT))
        : undefined;
    if (input.op === "create") {
      const cover = await findCover(authorId, input.cover_image_url);
      const tags = postTags([], input);
      const post = await createPost(
        {
          data: {
            title,
            cover_image: cover,
            tags,
            status: PostStatusOptions.Draft,
            type: PostTypes.Post,
          },
        },
        { prisma, session: { user: { id: authorId } } },
        body
      );
      if (post.__typename !== "Post")
        throw new Error("Unable to create MCP draft.");
      return reply({ id: post.id, title: post.title, status: "draft" }, 201);
    }
    return await updateOwnedPost(authorId, input, PostStatusOptions.Draft);
  } catch (error) {
    return failure(error);
  }
}
