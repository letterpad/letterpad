"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Modal } from "ui";

import { doOmniSearch } from "./data";
import { getReadableDate } from "../../shared/utils";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type SearchResults = UnwrapPromise<ReturnType<typeof doOmniSearch>>;

export const Search = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [posts, setPosts] = useState<SearchResults>([]);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setShowSearch(false);
    setPosts([]);
  };

  useEffect(() => {}, []);

  return (
    <>
      <BiSearch
        size={28}
        className="cursor-pointer"
        onClick={() => setShowSearch(true)}
      />
      <Modal toggle={closeModal} show={showSearch} header="Search">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const value = e.currentTarget.querySelector("#default-search");
            setLoading(true);
            const a = await doOmniSearch(value?.value);
            setLoading(false);
            setPosts(a);
          }}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <BiSearch size={20} />
            </div>
            <input
              disabled={loading}
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Posts..."
              required
              autoComplete="off"
            />
            <button
              disabled={loading}
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 overflow-y-scroll max-h-96">
          {posts.map((p) => {
            const author = p.author?.__typename === "Author" ? p.author : null;
            return (
              <div
                className="flex flex-row items-center mb-2 gap-3 py-3"
                key={p.id}
              >
                <div className="flex-none items-center justify-center bg-slate-100 cursor-pointer relative w-10 h-10 rounded-full overflow-hidden">
                  <Link href={`/@${author?.username}`}>
                    <img
                      alt={author?.name}
                      src={author?.avatar}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex flex-col w-full">
                  <div className="text-gray-500 dark:text-gray-400 flex gap-2">
                    <Link href={`/@${author?.username}`}>{author?.name}</Link>
                    <span>•</span>
                    <span>{getReadableDate(p.publishedAt)}</span>
                    <span>•</span>
                    <span>{p.reading_time}</span>
                  </div>
                  <Link
                    className="font-bold text-gray-700 dark:text-gray-300 text-[1rem]"
                    href={p.slug!}
                    target="_blank"
                  >
                    {p.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
