import test from "node:test";
import assert from "node:assert/strict";
import { renderMcpBody } from "../../../apps/admin/src/lib/mcp-body.mjs";

test("explicit Markdown renders semantic headings and paragraphs", () => {
  const output = renderMcpBody(
    "## A heading\n\nA **clear** explanation.",
    "markdown"
  );
  assert.match(output, /<h2>A heading<\/h2>/);
  assert.match(output, /<p>A <strong>clear<\/strong> explanation\.<\/p>/);
});

test("omitting body_format preserves existing plain-text escaping", () => {
  assert.equal(
    renderMcpBody("## Literal heading\n\n<b>Not HTML</b> & text"),
    "\u003cp>## Literal heading</p><p>&lt;b&gt;Not HTML&lt;/b&gt; &amp; text</p>"
  );
});

test("unknown body formats fail instead of silently changing interpretation", () => {
  for (const format of ["html", "HTML", "md", "", null, 42, {}])
    assert.throws(() => renderMcpBody("body", format), /body_format/);
});

test("Markdown preserves fenced code, lists and source links", () => {
  const out = renderMcpBody(
    "## Example\n\n- First\n- Second\n\n```python\ndef check():\n    return 1 < 2\n```\n\n[Source](https://example.com/docs)",
    "markdown"
  );
  assert.match(out, /<ul>/);
  assert.match(out, /<li>First<\/li>/);
  assert.match(
    out,
    /<pre><code class="language-python">def check\(\):\n    return 1 &lt; 2/
  );
  assert.match(out, /<a href="https:\/\/example.com\/docs">Source<\/a>/);
});

test("raw HTML and event handlers are text, not executable markup", () => {
  const out = renderMcpBody(
    '<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<svg onload="alert(1)"></svg>',
    "markdown"
  );
  assert.doesNotMatch(out, /<(?:script|img|svg)\b/i);
  assert.match(out, /&lt;script&gt;/);
});

test("dangerous Markdown URL schemes cannot become links or images", () => {
  for (const input of [
    "[x](javascript:alert(1))",
    "[x](jav&#x61;script:alert(1))",
    "[x](vbscript:alert(1))",
    "![x](data:text/html;base64,PHNjcmlwdD4=)",
    "[x](file:///etc/passwd)",
  ]) {
    const out = renderMcpBody(input, "markdown");
    assert.doesNotMatch(out, /<(?:a|img)\b/i);
  }
});
