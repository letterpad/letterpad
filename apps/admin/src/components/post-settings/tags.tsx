import { ReactNode, useEffect, useMemo, useState } from "react";
import ReactTags from "react-tag-autocomplete";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";
import { useTagsQuery } from "@/graphql/queries/queries.graphql";
import { textToSlug } from "@/utils/slug";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  header: ReactNode;
}

interface Tag {
  id: string;
  name: string;
}

const Tags = ({ post, header }: IProps) => {
  const initialTags =
    post.tags?.__typename === "TagsNode" ? post.tags.rows : [];
  const [tags, setTags] = useState<Tag[]>(addTagsWithId(initialTags));
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const { updatePost } = useUpdatePost();
  const { loading, data } = useTagsQuery({
    variables: { filters: { suggest: true } },
  });

  const computedTags = useMemo(
    () => (data?.tags.__typename === "TagsNode" ? data.tags.rows : []),
    [data],
  );

  useEffect(() => {
    if (!loading) {
      // remove used tags from suggestions
      const result = computedTags.filter((s) => {
        return !tags.find((t) => s.name === t.name);
      });

      setSuggestions(addTagsWithId(result));
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
    tag = { ...tag, name: textToSlug(tag.name) };
    const _tags = [...tags, { ...tag, id: tag.name }];
    setTags(_tags);
    saveTags(_tags);
    removeFromSuggestion(tag);
  };

  const removeFromSuggestion = ({ name }: Tag) => {
    setSuggestions(suggestions.filter((s) => s.name !== name));
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

        .react-tags__suggestions li:hover mark {
          color: rgb(var(--content-bg));
        }

        .react-tags__suggestions li.is-active mark {
          color: rgb(var(--content-bg));
        }

        .react-tags__suggestions li:hover {
          cursor: pointer;
          background: rgba(var(--accent), 0.9);
          color: rgb(var(--content-bg));
        }

        .react-tags__suggestions li.is-active {
          background: rgba(var(--accent), 0.9);
          color: rgb(var(--content-bg));
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

export default Tags;

function addTagsWithId(tags: { name: string; slug: string }[]) {
  return tags?.map((tag) => ({
    name: tag.name,
    slug: tag.name,
    id: tag.name,
  }));
}
