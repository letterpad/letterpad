# Letterpad MCP

This service exposes published Letterpad articles, private draft editing, and image uploads to MCP clients. It uses the SDK client in `packages/sdk/mcp.mjs` and the Letterpad admin app for data, author checks, and media storage.

## Run it

Apply the Prisma migration for your database and regenerate Prisma Client before starting the updated admin app. Set `LETTERPAD_MCP_ENABLED=true` on the admin app to enable its `/api/mcp-data` endpoint and show MCP token management. Published article tools work without credentials.

To write, sign in to Letterpad and go to **Settings → Keys → MCP tokens**. Create a token for the client and copy it when it is shown. A token belongs to the signed-in author, expires after 90 days, and can be revoked from the same page. A token permits draft reads and edits, image uploads, and changes to the public blog title, tagline, and description, all scoped to the author.

From the repository root:

```sh
docker build -f integrations/mcp/Dockerfile -t letterpad-mcp .
docker run --rm -p 127.0.0.1:3030:3030 \
  -e LETTERPAD_MCP_DATA_URL=https://your-admin.example/api/mcp-data \
  letterpad-mcp
```

To make it available remotely, route HTTPS traffic from your reverse proxy to port 3030 and configure your client with `https://mcp.example.com/mcp`. Forward the Authorization header. Allow requests up to 6 MiB for MCP tool calls or 4 MiB for the raw image upload endpoint. Use HTTPS for public endpoints. The bridge does not store the writer’s token. HTTP requests carrying an Origin header are rejected unless it exactly matches `LETTERPAD_MCP_ALLOWED_ORIGIN`. A client such as Codex generally does not send an Origin header.

## Connect Codex

For public reading tools, run `codex mcp add letterpad --url http://127.0.0.1:3030/mcp`. For drafts and uploads, set `LETTERPAD_MCP_TOKEN` in the client environment to the token you created in Letterpad, then configure Codex:

```toml
[mcp_servers.letterpad]
url = "http://127.0.0.1:3030/mcp"
bearer_token_env_var = "LETTERPAD_MCP_TOKEN"
```

| Tool | Purpose |
| --- | --- |
| `list_my_posts` | List only your published posts, newest first. Use `nextOffset` to continue. |
| `get_my_post` | Read one of your published posts by ID, including tags and topic category. |
| `list_my_drafts` | List your drafts, newest edit first. Use `nextOffset` to continue. |
| `get_my_post` | Read your published post, including tags and topic category, by ID. |
| `get_my_draft` | Read the draft body and metadata, including tags and topic category, using an ID from your own draft list. |
| `create_draft` | Save a title, plain-text body, optional cover, tags, and topic category as an unpublished post. |
| `update_draft` | Update your unpublished post’s title, body, cover, tags, or topic category by ID. |
| `update_my_post` | Update your published post’s title, body, cover, tags, or topic category by ID. |
| `publish_my_draft` | Publish one of your own drafts. |
| `get_my_blog_settings` | Read your blog’s current title, tagline, and description. |
| `update_my_blog_settings` | Change your blog title, tagline, or description. Omitted fields keep their current values. Send an empty description to clear it. |
| `upload_image` | Save standard base64 image data to the writer’s media library. |

## Upload a local image

Use the raw upload endpoint when an agent can access the local file. This avoids sending base64 through the model:

```sh
curl --fail-with-body --request PUT \
  --header "Authorization: Bearer $LETTERPAD_MCP_TOKEN" \
  --header "Content-Type: application/octet-stream" \
  --header "X-Letterpad-Filename: cover.jpg" \
  --data-binary @cover.jpg \
  http://127.0.0.1:3030/uploads
```

Uploads accept JPEG, PNG, WebP, and GIF up to 4 MiB and 24 megapixels. MCP uploads use the configured Cloudinary account. Pass the returned `url` as `cover_image_url` to `create_draft`, `update_draft`, or `update_my_post`. Pass ordinary tag names in `tags`. Letterpad's “category” is its single topic category; use `categories` with zero or one supported topic value (for example, `["technology"]`, or `[]` to clear it). Every post operation is restricted to posts owned by the token's writer.
