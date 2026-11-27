import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

import { createLetterpadMcpClient } from "../../packages/sdk/mcp.mjs";

const dataUrl = process.env.LETTERPAD_MCP_DATA_URL;
if (!dataUrl) throw new Error("Set LETTERPAD_MCP_DATA_URL before starting.");
createLetterpadMcpClient(dataUrl); // Validate the fixed upstream URL on startup.

const app = express();
app.disable("x-powered-by");
const allowedOrigin = process.env.LETTERPAD_MCP_ALLOWED_ORIGIN;
const MAX_BASE64_LENGTH = Math.ceil((4 * 1024 * 1024) / 3) * 4;

function registerTools(server, api) {
  const draftId = z.string().trim().min(1).max(100);
  const page = {
    limit: z.number().int().min(1).max(25).optional(),
    offset: z.number().int().min(0).max(1000).optional(),
  };
  const title = z.string().trim().min(1).max(190);
  const body = z.string().trim().min(1).max(60_000);
  const tag = z.string().trim().min(1).max(50);
  const categories = z.array(z.enum([
    "health-&-wellness", "technology", "travel-&-adventure", "entertainment",
    "business-&-finance", "food-&-cooking", "personal-development", "science",
    "sports", "art-&-creativity", "fashion", "environment", "education",
    "philosophy", "social-media", "programming", "gaming", "photography",
    "literature", "music", "film", "design", "entrepreneurship", "mindfulness",
    "psychology", "sustainability", "history", "astronomy", "fitness", "diy-crafts",
  ])).max(1).describe("Letterpad topic category. Supply zero or one category; [] clears it.");
  const cover_image_url = z
    .url()
    .max(255)
    .describe("URL returned by upload_image.");
  const draftFields = {
    title,
    body,
    cover_image_url: cover_image_url.optional(),
    tags: z.array(tag).max(20).optional(),
    categories: categories.optional(),
  };

  function register(
    name,
    description,
    inputSchema,
    action,
    readOnlyHint = false,
    destructiveHint = false,
  ) {
    server.registerTool(
      name,
      {
        description,
        inputSchema,
        annotations: { readOnlyHint, destructiveHint },
      },
      async (args) => {
        try {
          const result = await action(args);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text:
                  error instanceof Error
                    ? error.message
                    : "Letterpad request failed.",
              },
            ],
          };
        }
      },
    );
  }

  register(
    "list_my_posts",
    "List only your own published Letterpad posts, newest first.",
    page,
    api.listMyPosts,
    true,
  );

  register(
    "get_my_post",
    "Read one of your own published Letterpad posts by its post ID.",
    { id: draftId },
    api.getMyPost,
    true,
  );

  register(
    "list_my_drafts",
    "List your unpublished Letterpad posts, newest edit first. Use the returned draft ID with get_my_draft.",
    page,
    api.listMyDrafts,
    true,
  );

  register(
    "get_my_draft",
    "Read the private draft body and metadata for one of your unpublished Letterpad posts.",
    { id: draftId },
    api.getMyDraft,
    true,
  );

  register(
    "create_draft",
    "Create an unpublished Letterpad post with a plain-text body and optional uploaded cover.",
    draftFields,
    api.createDraft,
  );

  register(
    "update_draft",
    "Edit an existing unpublished post owned by the authenticated writer. Provide the draft ID and any fields to change.",
    {
      id: draftId,
      title: title.optional(),
      body: body.optional(),
      cover_image_url: cover_image_url.optional(),
      tags: z.array(tag).max(20).optional(),
      categories: categories.optional(),
    },
    api.updateDraft,
  );

  register(
    "publish_my_draft",
    "Publish one of your own drafts so it becomes public on your Letterpad blog.",
    { id: draftId },
    api.publishMyDraft,
    false,
    true,
  );

  register(
    "update_my_post",
    "Edit your own published post, including its content, cover, tags, and Letterpad topic category.",
    {
      id: draftId,
      title: title.optional(),
      body: body.optional(),
      cover_image_url: cover_image_url.optional(),
      tags: z.array(tag).max(20).optional(),
      categories: categories.optional(),
    },
    api.updateMyPost,
  );

  register(
    "get_my_blog_settings",
    "Read your own blog's public title, tagline, and description.",
    {},
    api.getMyBlogSettings,
    true,
  );

  register(
    "update_my_blog_settings",
    "Change your own blog's public title, tagline, or description. Provided fields replace the current values, and an empty description clears it.",
    z.strictObject({
      site_title: z.string().trim().min(1).max(30).optional(),
      site_tagline: z.string().trim().min(1).max(60).optional(),
      site_description: z.string().trim().max(190).optional(),
    }),
    api.updateMyBlogSettings,
  );

  register(
    "upload_image",
    "Save a JPEG, PNG, WebP, or GIF of up to 4 MiB to the writer’s Letterpad media library.",
    {
      filename: z.string().trim().min(1).max(140),
      base64: z
        .string()
        .min(4)
        .max(MAX_BASE64_LENGTH)
        .describe(
          "Standard base64 of the local file, without a data URL prefix.",
        ),
    },
    api.uploadImage,
  );
}

function rpcError(res, status, message) {
  return res.status(status).json({
    jsonrpc: "2.0",
    id: null,
    error: { code: -32000, message },
  });
}

app.use(["/mcp", "/uploads"], (req, res, next) => {
  const origin = req.get("origin");
  if (origin && origin !== allowedOrigin) {
    return rpcError(res, 403, "Origin not allowed.");
  }
  next();
});

app.post(
  "/mcp",
  express.json({ limit: "6mb", inflate: false }),
  async (req, res) => {
    const server = new McpServer({ name: "letterpad", version: "0.1.0" });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.once("close", () => void server.close().catch(() => {}));
    try {
      registerTools(
        server,
        createLetterpadMcpClient(dataUrl, req.get("authorization")),
      );
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch {
      if (!res.headersSent) rpcError(res, 500, "Letterpad MCP request failed.");
    }
  },
);

app.all("/mcp", (_req, res) => {
  res.set("Allow", "POST");
  rpcError(res, 405, "Use POST for this stateless MCP endpoint.");
});

app.put(
  "/uploads",
  (req, res, next) => {
    if (!req.is("application/octet-stream")) {
      return res
        .status(415)
        .json({ error: "Send the image as application/octet-stream." });
    }
    if (!/^Bearer [^\s]+$/i.test(req.get("authorization") ?? "")) {
      return res
        .status(401)
        .json({ error: "A Letterpad bearer token is required." });
    }
    next();
  },
  express.raw({
    type: "application/octet-stream",
    limit: "4mb",
    inflate: false,
  }),
  async (req, res) => {
    const filename = req.get("x-letterpad-filename");
    if (!filename || !Buffer.isBuffer(req.body) || !req.body.length) {
      return res
        .status(400)
        .json({ error: "Provide an image and X-Letterpad-Filename header." });
    }
    try {
      const api = createLetterpadMcpClient(dataUrl, req.get("authorization"));
      const image = await api.uploadImageFile(filename, req.body);
      return res.status(201).json(image);
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 502;
      return res.status(status).json({
        error: error instanceof Error ? error.message : "Image upload failed.",
      });
    }
  },
);

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = [400, 413, 415].includes(error.status) ? error.status : 500;
  const message =
    status < 500
      ? "Invalid or oversized request body."
      : "Letterpad MCP request failed.";
  if (req.path === "/uploads")
    return res.status(status).json({ error: message });
  return rpcError(res, status, message);
});

const port = Number(process.env.PORT ?? 3030);
app.listen(port, "0.0.0.0", () =>
  console.log(`Letterpad MCP listening on port ${port}`),
);
