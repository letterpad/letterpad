"use client";

import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import { IoSearchOutline } from "@react-icons/all-files/io5/IoSearchOutline";
import Link from "next/link";
import { useRef, useState } from "react";

import { doOmniSearch } from "./data";
import { EventAction, EventCategory, track } from "../../track";

type SearchResults = Awaited<ReturnType<typeof doOmniSearch>>;

export function Search({ showLabel = false }: { showLabel?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  function reset() {
    requestId.current++;
    setResults(null);
    setError(false);
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        className={showLabel ? "editorial-search" : "inline-flex items-center"}
        onClick={() => {
          dialog.current?.showModal();
          field.current?.focus();
        }}
      >
        <IoSearchOutline size={22} aria-hidden="true" />
        {showLabel && <span>Search</span>}
      </button>
      <dialog
        ref={dialog}
        aria-label="Search Letterpad"
        onClose={reset}
        style={{ width: "min(36rem, calc(100% - 2rem))" }}
        className="m-auto rounded-lg border border-gray-200 bg-white p-5 text-gray-900 shadow-lg backdrop:bg-black/45 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Search Letterpad</h2>
          <button
            type="button"
            className="p-2"
            aria-label="Close search"
            onClick={() => dialog.current?.close()}
          >
            <IoCloseOutline aria-hidden="true" size={23} />
          </button>
        </div>
        <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const term = field.current?.value.trim() ?? "";
            if (term.length < 2) return;
            const id = ++requestId.current;
            setLoading(true);
            setError(false);
            if (typeof gtag === "function") {
              track({
                eventAction: EventAction.Click,
                eventCategory: EventCategory.OmniSearch,
                eventLabel: `search-${term}`,
              });
            }
            try {
              const stories = await doOmniSearch(term);
              if (requestId.current === id) setResults(stories);
            } catch {
              if (requestId.current === id) setError(true);
            } finally {
              if (requestId.current === id) setLoading(false);
            }
          }}
        >
          <input
            ref={field}
            type="search"
            aria-label="Search stories"
            placeholder="Search stories…"
            required
            minLength={2}
            maxLength={120}
            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-transparent p-3 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-neutral-900 px-4 font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
        <div aria-live="polite" className="mt-4 max-h-80 overflow-y-auto">
          {error && <p>Search is temporarily unavailable. Try again.</p>}
          {!error && results && !results.length && <p>No stories found.</p>}
          {!error &&
            results?.map((story) => (
              <article
                className="border-b border-gray-200 py-3 dark:border-gray-700"
                key={story.id}
              >
                <Link
                  href={story.url}
                  prefetch={false}
                  className="font-semibold hover:underline"
                >
                  {story.title}
                </Link>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <Link
                    href={story.authorHref}
                    prefetch={false}
                    className="hover:underline"
                  >
                    {story.author}
                  </Link>
                  {story.readingTime && <span> · {story.readingTime}</span>}
                </div>
              </article>
            ))}
        </div>
      </dialog>
    </>
  );
}
