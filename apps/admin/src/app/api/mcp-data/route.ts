import { imageSize } from "image-size";
import { PostStatusOptions, PostTypes } from "letterpad-graphql";

import { createPost } from "@/graphql/services/post/createPost";
import { updateSetting } from "@/graphql/services/setting/updateSetting";
import { getMcpWriter } from "@/lib/mcpTokens";
import { prisma } from "@/lib/prisma";
import { storeMediaUpload } from "@/lib/storeMediaUpload";
import { getRootUrl } from "@/shared/getRootUrl";
import logger from "@/shared/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MAX_BODY_TEXT = 60_000;
const MAX_RETURNED_HTML = 60_000;
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
  author: {
    name: string | null;
    username: string | null;
    setting: { site_url: string } | null;
  } | null;
}) {
  const { author, ...data } = post;
  return {
    ...data,
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
    const { html_draft, ...metadata } = draft;
    return reply({ ...metadata, ...htmlResponse(html_draft ?? "") });
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
    drafts: drafts.slice(0, limit),
    nextOffset: nextOffset(drafts.length, limit, offset),
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

export async function GET(request: Request) {
  if (process.env.LETTERPAD_MCP_ENABLED !== "true")
    return reply({ error: "Not found." }, 404);
  try {
    const query = new URL(request.url).searchParams;
    const op = query.get("op");
    if (op === "get-settings") return await readBlogSettings(request);
    if (op === "list-drafts" || op === "get-draft") {
      return await readDrafts(request, query, op);
    }
    const username = query.get("username");
    if (username !== null) textField(username, "username", 100);
    if (op === "get") {
      const post = await prisma.post.findFirst({
        where: {
          ...publishedArticle,
          author: { username: textField(username, "username", 100) },
          slug: textField(query.get("slug"), "slug", 255),
        },
        select: { ...articleMetadata, html: true },
      });
      if (!post) throw new RequestError("Published article not found.", 404);
      const { html, ...metadata } = post;
      return reply({
        ...articleResponse(metadata),
        ...htmlResponse(html),
      });
    }
    if (op !== "list") throw new RequestError("Unknown public operation.");
    const { limit, offset } = readPage(query);
    const posts = await prisma.post.findMany({
      where: {
        ...publishedArticle,
        exclude_from_home: false,
        ...(username ? { author: { username: username.trim() } } : {}),
      },
      select: articleMetadata,
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      skip: offset,
      take: limit + 1,
    });
    const postList = posts.slice(0, limit).map(articleResponse);
    return reply({
      posts: postList,
      nextOffset: nextOffset(posts.length, limit, offset),
    });
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

async function findCover(authorId: string, value: unknown) {
  if (value === undefined) return undefined;
  const url = textField(value, "cover_image_url", 255);
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
    throw new RequestError("Cover image not found in your media library.", 404);
  return { src: image.url, width: image.width, height: image.height };
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
  const media = await storeMediaUpload(authorId, {
    buffer,
    originalname: filename,
  });
  return reply(
    {
      url: new URL(media.src, getRootUrl()).toString(),
      width: media.size.width,
      height: media.size.height,
    },
    201
  );
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
    if (input.op === "upload") return await uploadImage(authorId, input);
    if (input.op === "update-settings")
      return await updateBlogSettings(authorId, input);
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
    const cover = await findCover(authorId, input.cover_image_url);

    if (input.op === "create") {
      const post = await createPost(
        {
          data: {
            title,
            cover_image: cover,
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
    if (title === undefined && body === undefined && cover === undefined) {
      throw new RequestError("Supply a title, body, or cover image to update.");
    }
    const id = textField(input.id, "id", 100);
    const updated = await prisma.post.updateMany({
      where: { ...editableDrafts(authorId), id },
      data: {
        title,
        html_draft: body,
        cover_image: cover?.src,
        cover_image_width: cover?.width,
        cover_image_height: cover?.height,
      },
    });
    if (updated.count === 0)
      throw new RequestError("Editable draft not found.", 404);
    return reply({ id, status: "draft" });
  } catch (error) {
    return failure(error);
  }
}
