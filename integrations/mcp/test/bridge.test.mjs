import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
async function fixture() {
  const writes = [];
  const upstream = http.createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    writes.push({
      authorization: req.headers.authorization,
      body: JSON.parse(body),
    });
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ id: "fixture-draft", ok: true }));
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  const reserve = http.createServer();
  reserve.listen(0, "127.0.0.1");
  await once(reserve, "listening");
  const port = reserve.address().port;
  await new Promise((r) => reserve.close(r));
  const child = spawn(process.execPath, ["integrations/mcp/server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      LETTERPAD_MCP_DATA_URL: `http://127.0.0.1:${upstream.address().port}/api/mcp-data`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stderr.on("data", (b) => (logs += b));
  child.stdout.on("data", (b) => (logs += b));
  for (let n = 0; n < 80; n++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/healthz`);
      if (r.ok) break;
    } catch {}
    if (n === 79) throw Error("Bridge failed to start: " + logs);
    await new Promise((r) => setTimeout(r, 50));
  }
  return {
    writes,
    async rpc(method, params) {
      const r = await fetch(`http://127.0.0.1:${port}/mcp`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
          authorization: "Bearer fixture-author-token",
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      });
      return r.json();
    },
    async close() {
      child.kill("SIGTERM");
      if (child.exitCode === null) await once(child, "exit");
      await new Promise((r) => upstream.close(r));
    },
  };
}

test("all three MCP writing tools advertise explicit Markdown format", async () => {
  const f = await fixture();
  try {
    const response = await f.rpc("tools/list", {});
    for (const name of ["create_draft", "update_draft", "update_my_post"]) {
      const tool = response.result.tools.find((t) => t.name === name);
      assert.deepEqual(tool.inputSchema.properties.body_format?.enum, [
        "plain",
        "markdown",
      ]);
      assert.ok(!tool.inputSchema.required?.includes("body_format"));
    }
  } finally {
    await f.close();
  }
});

test("Markdown reaches the author-scoped upstream unchanged", async () => {
  const f = await fixture();
  try {
    const result = await f.rpc("tools/call", {
      name: "update_draft",
      arguments: {
        id: "fixture-draft",
        body: "## Heading\n\n```python\nprint(1)\n```",
        body_format: "markdown",
      },
    });
    assert.ok(!result.result?.isError);
    assert.equal(f.writes.length, 1);
    assert.equal(f.writes[0].authorization, "Bearer fixture-author-token");
    assert.equal(f.writes[0].body.body_format, "markdown");
    assert.equal(f.writes[0].body.op, "update");
  } finally {
    await f.close();
  }
});

test("invalid body format is rejected before any upstream write", async () => {
  const f = await fixture();
  try {
    const result = await f.rpc("tools/call", {
      name: "create_draft",
      arguments: {
        title: "Fixture",
        body: "<script>x</script>",
        body_format: "html",
      },
    });
    assert.ok(result.error || result.result?.isError);
    assert.equal(f.writes.length, 0);
  } finally {
    await f.close();
  }
});
