"use client";

import { useEffect, useState } from "react";

import { basePath } from "@/constants";

interface TokenMetadata {
  id: string;
  name: string;
  expiresAt: string;
}

const endpoint = basePath + "/api/mcp-tokens";

async function request(path = "", init?: RequestInit) {
  const response = await fetch(endpoint + path, { ...init, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error ?? "Unable to manage MCP tokens.");
  }
  return data;
}

export function McpTokens() {
  const [tokens, setTokens] = useState<TokenMetadata[]>([]);
  const [name, setName] = useState("");
  const [revealed, setRevealed] = useState<
    (TokenMetadata & { token: string }) | null
  >(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    request("", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setTokens(data.tokens);
      })
      .catch((error: Error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setPending(false);
      });
    return () => controller.abort();
  }, []);

  async function createToken() {
    if (!name.trim()) return;
    setPending(true);
    setError("");
    setCopied(false);
    try {
      const { token, ...metadata } = await request(
        "?" + new URLSearchParams({ name: name.trim() }),
        { method: "POST" }
      );
      setTokens((previous) => [metadata, ...previous]);
      setRevealed({ ...metadata, token });
      setName("");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function revokeToken(id: string) {
    setPending(true);
    setError("");
    try {
      await request("?" + new URLSearchParams({ id }), { method: "DELETE" });
      setTokens((previous) => previous.filter((token) => token.id !== id));
      setRevealed((previous) => (previous?.id === id ? null : previous));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function copyToken(token: string) {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
    } catch {
      setError("Clipboard unavailable. Select and copy the token manually.");
    }
  }

  return (
    <div className="mb-8 space-y-3">
      <h3 className="font-semibold">MCP tokens</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Allow a client to read and edit your drafts and upload images to your
        blog. Tokens expire after 90 days.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="mcp-token-name" className="sr-only">
          Token name
        </label>
        <input
          id="mcp-token-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (!pending) void createToken();
          }}
          maxLength={80}
          placeholder="Token name, e.g. Codex"
          className="rounded border bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={pending || !name.trim()}
          onClick={() => void createToken()}
          className="rounded border px-3 py-2 text-sm disabled:opacity-50"
        >
          Create token
        </button>
      </div>
      {revealed && (
        <div className="space-y-2">
          <p className="text-sm">Copy this token now. It’s shown only once.</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="New MCP token"
              value={revealed.token}
              readOnly
              onFocus={(event) => event.target.select()}
              className="min-w-0 flex-1 rounded border bg-transparent px-3 py-2 font-mono text-sm"
            />
            <button
              type="button"
              className="rounded border px-3 py-2 text-sm"
              onClick={() => void copyToken(revealed.token)}
            >
              {copied ? "Copied" : "Copy token"}
            </button>
          </div>
        </div>
      )}
      {tokens.length > 0 && (
        <ul className="divide-y rounded border dark:divide-gray-700">
          {tokens.map((token) => (
            <li
              key={token.id}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <span className="min-w-0 break-words">
                {token.name}
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Expires {new Date(token.expiresAt).toLocaleDateString()}
                </span>
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() => void revokeToken(token.id)}
                className="text-sm text-red-600 disabled:opacity-50 dark:text-red-400"
                aria-label={`Revoke ${token.name}`}
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
