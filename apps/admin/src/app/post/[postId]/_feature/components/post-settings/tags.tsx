import { PostWithAuthorAndTagsFragment } from "graphql-letterpad";
import { ReactNode, useEffect, useMemo, useState } from "react";
import ReactTags from "react-tag-autocomplete";

import { useGetTags } from "@/app/tags/_feature/api.client";
import { beautifyTopic, TOPIC_PREFIX } from "@/shared/utils";
import { textToSlug } from "@/utils/slug";

import { tags } from "./constants";
import { Heading } from "./heading";
import { useUpdatePost } from "../../api.client";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  header: ReactNode;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export const Tags = ({ post, header }: IProps) => {
  const initialTags =
    post.tags?.__typename === "TagsNode"
      ? post.tags.rows.filter((t) => !t.name.startsWith(TOPIC_PREFIX))
      : [];
  const [tags, setTags] = useState<Tag[]>(addTagsWithId(initialTags));
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const { updatePost } = useUpdatePost();
  const { data, fetching: loading } = useGetTags({ suggest: true });

  const computedTags = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!loading) {
      // remove used tags from suggestions
      const result = computedTags.filter((s) => {
        return !tags.find((t) => s.name === t.name);
      });

      const resultWithCount = result.map((tag) => {
        const count =
          tag.posts?.__typename === "PostsNode" ? tag.posts.count : 0;
        return {
          ...tag,
          name: `${tag.name} ${count ? `(${count})` : ""}`,
          slug: tag.name,
        };
      });

      setSuggestions(addTagsWithId(resultWithCount));
    }
  }, [computedTags, loading, tags]);

  const saveTags = (tags: Tag[]) => {
    updatePost({
      id: post.id,
      tags: tags.map((t) => ({ name: t.name, slug: t.name })),
    });
  };

  const onDelete = (i) => {
    if (i === -1) return false;
    const _tags = tags.slice(0);
    _tags.splice(i, 1);
    const removedTag = tags[i];

    addToSuggestion(removedTag);
    setTags(_tags);
    saveTags(_tags);
  };

  const onAddition = (tag) => {
    tag = {
      ...tag,
      name: textToSlug(removeCount(tag.name)),
    };
    if (tag.name.startsWith(TOPIC_PREFIX)) {
      alert(`${TOPIC_PREFIX} is reserved for system use`);
      return;
    }
    const _tags = [...tags, { ...tag, id: removeCount(tag.name) }];
    setTags(_tags);
    saveTags(_tags);
    removeFromSuggestion(tag);
  };

  const removeFromSuggestion = ({ name }: Tag) => {
    setSuggestions(suggestions.filter((s) => removeCount(s.name) !== name));
  };

  const addToSuggestion = (tag: Tag) => {
    setSuggestions([...suggestions, { ...tag }]);
  };

  return (
    <div>
      {header}
      <div className="w-full rounded-md border border-gray-300 bg-gray-50  p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <ReactTags
          tags={tags}
          onDelete={onDelete}
          onAddition={onAddition}
          allowNew
          suggestions={suggestions}
          delimiters={["Enter", "Tab", ","]}
        />
      </div>
      <style jsx global>{`
        .react-tags {
          position: relative;
          padding: 6px 0 0 6px;
          /* shared font styles */
          font-size: 1em;
          line-height: 1.2;

          /* clicking anywhere will focus the input */
          cursor: text;
        }

        .react-tags__selected {
          display: inline;
        }

        .react-tags__selected-tag {
          display: inline-block;
          box-sizing: border-box;
          margin: 0 6px 6px 0;
          padding: 6px 8px;
          border: 1px solid #0b5cbe;
          border-radius: 6px;
          background: #0b5cbe;
          color: #fff;
          /* match the font styles */
          font-size: inherit;
          line-height: inherit;
        }
        .react-tags__selected-tag:after {
          content: "x";
          margin-left: 8px;
        }
        .react-tags__search {
          display: block;

          /* match tag layout */
          padding: 7px 2px;
          margin-bottom: 6px;

          /* prevent autoresize overflowing the container */
          max-width: 100%;
        }

        @media screen and (min-width: 30em) {
          .react-tags__search {
            /* this will become the offsetParent for suggestions */
            position: relative;
          }
        }

        .react-tags__search input {
          /* prevent autoresize overflowing the container */
          max-width: 100%;

          /* remove styles and layout from this element */
          margin: 0;
          padding: 0;
          border: 0;
          outline: none;

          /* match the font styles */
          font-size: inherit;
          line-height: inherit;
          background: transparent;
        }
        .react-tags__search input:focus {
          box-shadow: 0 0px 0px rgba(0, 0, 0, 0.3) inset !important;
          outline: none;
        }
        .react-tags__suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          z-index: 99999;
        }

        @media screen and (min-width: 30em) {
          .react-tags__suggestions {
            width: 240px;
          }
        }

        .react-tags__suggestions ul {
          margin: 4px -1px;
          padding: 0;
          list-style: none;
          background: rgb(var(--sidebar-bg));
          border: 1px solid rgb(var(--color-border));
          border-radius: 2px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .react-tags__suggestions li:not(:last-child) {
          border-bottom: 1px solid rgba(var(--color-border), 0.9);
        }
        .react-tags__suggestions li {
          padding: 10px 8px;
        }

        .react-tags__suggestions li mark {
          background: none;
          margin: 0;
          padding: 0;
          font-weight: bold;
        }

        .react-tags__suggestions li {
          background: rgb(var(--content-bg));
        }

        .dark .react-tags__suggestions li mark,
        .dark .react-tags__suggestions li mark {
          color: #fff;
          font-weight: bold;
        }

        .react-tags__suggestions li:hover {
          cursor: pointer;
          background: #283141;
        }

        .dark .react-tags__suggestions li.is-active {
          background: #283141;
        }
        .light .react-tags__suggestions li.is-active {
          background: #eee;
        }

        .react-tags__suggestions li.is-disabled {
          opacity: 0.5;
          cursor: auto;
        }

        .react-tags__search input::-ms-clear {
          display: none;
        }

        .react-tags__selected-tag:hover,
        .react-tags__selected-tag:focus {
          border-color: rgb(var(--color-border));
        }
      `}</style>
    </div>
  );
};

function addTagsWithId(tags: { name: string; slug: string }[]) {
  return tags?.map((tag) => ({
    name: tag.name,
    slug: tag.name,
    id: tag.name,
  }));
}

function removeCount(str: string) {
  return str.replace(/\([^)]*\)/, "").trim();
}

export const PrimaryTag = ({ selected, onSelect }) => {
  return (
    <div>
      <Heading
        heading="Topic"
        subheading={
          "Choose the relevant topic for this post. This will be used to categorize your post."
        }
      />
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          e.target.value && onSelect(e.target.value)
        }
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">Select</option>
        {tags.sort().map((tag) => (
          <option key={tag} value={tag} selected={tag === selected}>
            {beautifyTopic(tag)}
          </option>
        ))}
      </select>
    </div>
  );
};
