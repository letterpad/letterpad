import ReactTags from "react-tag-autocomplete";
import { useEffect, useState } from "react";
import { InputUpdatePost } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/queries.graphql";
import { useTagsQuery } from "@/graphql/queries/queries.graphql";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  setPostAttribute: (attrs: Omit<InputUpdatePost, "id">) => void;
}

interface Tag {
  id: string;
  name: string;
}

const Tags = ({ post, setPostAttribute }: IProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const { loading, data } = useTagsQuery({
    variables: { filters: { suggest: true } },
  });

  useEffect(() => {
    if (!loading && data?.tags.__typename === "TagsNode") {
      // remove used tags from suggestions
      const result = data.tags.rows.filter((s) => {
        return !tags.find((t) => s.name === t.name);
      });

      setSuggestions(addTagsWithId(result));
    }
  }, [loading]);

  useEffect(() => {
    if (post.__typename !== "Post") return;
    setTags(addTagsWithId(post.tags ?? []));
  }, [post.__typename]);

  useEffect(() => {
    setPostAttribute({
      tags: tags.map((t) => ({ name: t.name, slug: t.name })),
    });
  }, [tags]);

  const onDelete = (i) => {
    if (i === -1) return false;
    const _tags = tags.slice(0);
    _tags.splice(i, 1);
    const removedTag = tags[i];

    addToSuggestion(removedTag);
    setTags(_tags);
  };

  const onAddition = (tag) => {
    setTags([...tags, { ...tag, id: tag.name }]);
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
      <label>Tags</label>
      <br />
      <ReactTags
        tags={tags}
        onDelete={onDelete}
        onAddition={onAddition}
        allowNew
        suggestions={suggestions}
      />
      <style jsx global>{`
        .react-tags {
          position: relative;
          padding: 6px 0 0 6px;
          border: 1px solid rgb(var(--color-border));
          border-radius: 1px;

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
          border: 1px solid rgb(var(--color-border));
          border-radius: 2px;
          background: var(--content-bg);

          /* match the font styles */
          font-size: inherit;
          line-height: inherit;
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

        .react-tags__suggestions li {
          border-bottom: 1px solid rgb(var(--color-border));
          padding: 10px 8px;
        }

        .react-tags__suggestions li mark {
          background: none;
          color: rgb(var(--color));
        }

        .react-tags__suggestions li:hover {
          cursor: pointer;
          background: rgb(var(--color-border));
        }

        .react-tags__suggestions li.is-active {
          background: rgb(var(--section-bg));
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
