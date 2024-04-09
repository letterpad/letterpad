import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import ReactTags from "react-tag-autocomplete";
import { Message } from "ui";

import "./tags.css";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { useGetProModal } from "@/components/get-pro-modal-provider";

import { useGetTags } from "@/app/tags/_feature/api.client";
import { beautifyTopic, TOPIC_PREFIX } from "@/shared/utils";
import { EventAction, track } from "@/track";
import { textToSlug } from "@/utils/slug";

import { tags } from "./constants";
import { Heading } from "./heading";
interface IProps {
  post: PostWithAuthorAndTagsFragment;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const removeNull = (arr) => arr.filter((value) => value !== null);

export const Tags = ({ post }: IProps) => {
  const { setValue, watch } = useFormContext<PostWithAuthorAndTagsFragment>();
  const topic = post.tags?.["rows"].find((t) =>
    t?.name?.startsWith(TOPIC_PREFIX)
  );
  const { setIsOpen } = useGetProModal();
  const initialTags =
    post.tags?.["rows"]?.filter((t) => !t?.name?.startsWith(TOPIC_PREFIX)) ??
    [];
  const [tags, setTags] = useState<Tag[]>(addTagsWithId(initialTags));
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const { data, fetching: loading } = useGetTags({ search }, { skip: !search });
  const [busy, setBusy] = useState(false);
  const computedTags = useMemo(() => data ?? [], [data]);
  const isPaidMember = useIsPaidMember();

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setSearch(query);
  };
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

  const saveTags = async () => {
    const isDirty = isTagsDirty(tags, watch("tags.rows"));
    if (!isDirty) return;
    const resultTags = [
      ...tags.map((t) => ({ name: t.name, slug: t.name })),
      topic ? { ...topic } : null,
    ];
    if (topic) resultTags.push(topic);
    setValue("tags.rows", removeNull(resultTags), {
      shouldDirty: isDirty,
      shouldTouch: isDirty,
      shouldValidate: isDirty,
    });
  };

  const onDelete = (i) => {
    if (i === -1) return false;
    const _tags = tags.slice(0);
    _tags.splice(i, 1);
    const removedTag = tags[i];

    addToSuggestion(removedTag);
    setTags(_tags);
  };

  const onAddition = (tag) => {
    if (!tag.name) return;
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
    removeFromSuggestion(tag);
  };

  const removeFromSuggestion = ({ name }: Tag) => {
    setSuggestions(suggestions.filter((s) => removeCount(s.name) !== name));
  };

  const addToSuggestion = (tag: Tag) => {
    setSuggestions([...suggestions, { ...tag }]);
  };

  const generateTags = async (e) => {
    e.preventDefault();
    if (!isPaidMember) {
      track({
        eventAction: EventAction.Click,
        eventCategory: "pro-modal",
        eventLabel: `tags`,
      });
      setIsOpen(true);
      return;
    }
    if (!post.html_draft || post.html_draft.length < 300) {
      Message().error({
        content:
          "Please write a post with at least 300 characters to generate tags.",
        duration: 5,
      });
      return;
    }
    try {
      setBusy(true);
      const element = document.createElement("div");
      element.innerHTML = post.html_draft ?? "";
      element.querySelectorAll("pre").forEach((pre) => {
        pre.remove();
      });
      const prompt = element.textContent;
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          field: "tags",
        }),
      });
      const text = await response.text();
      const tags = text.split(",").map((t) => {
        return {
          name: t,
          slug: t,
          id: t,
        };
      });
      if (topic) tags.push(topic);
      setValue("tags.rows", tags, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (e) {}
    setBusy(false);
  };

  return (
    <div>
      <Heading
        heading="Tags"
        subheading={
          <>
            Add or change tags (up to 5) so readers can discover your posts and
            know what your story is about.
          </>
        }
      />
      <div className="w-full rounded-md border border-gray-300 bg-gray-50  p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <ReactTags
          tags={tags}
          onDelete={onDelete}
          onAddition={onAddition}
          allowNew
          suggestions={suggestions}
          delimiters={["Enter", "Tab", ","]}
          onBlur={saveTags}
          onInput={fetchSuggestions}
        />
        <div className="mt-2">
          {busy ? (
            <CgSpinner className="animate-spin w-5 h-5" />
          ) : (
            <Link href="#" onClick={generateTags}>
              Generate ✨
            </Link>
          )}
        </div>
      </div>
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

export const PrimaryTag = () => {
  const { control } = useFormContext<PostWithAuthorAndTagsFragment>();

  return (
    <div>
      <Heading
        heading="Topic"
        subheading={
          "Choose the relevant topic for this post. This will be used to categorize your post."
        }
      />
      <Controller
        name="tags.rows"
        control={control}
        render={({ field: { onChange, value = [] } }) => {
          value = value.filter((v) => v !== null);
          const tagsWithoutTopic = value.filter(
            (tag) => !tag.name?.startsWith(TOPIC_PREFIX)
          );

          const selected = value.find((t) => tags.includes(t.name))?.name ?? "";

          return (
            <>
              <select
                data-testid="topicSelect"
                value={selected}
                onChange={(e) => {
                  const tag = {
                    slug: e.target.value,
                    name: e.target.value,
                    __typename: "Tag",
                  };
                  onChange(
                    e.target.value !== ""
                      ? [...tagsWithoutTopic, tag]
                      : tagsWithoutTopic
                  );
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select</option>
                {tags.sort().map((tag) => (
                  <option key={tag} value={tag}>
                    {beautifyTopic(tag)}
                  </option>
                ))}
              </select>
            </>
          );
        }}
      />
    </div>
  );
};

const isTagsDirty = (tags: { name: string }[], oldTags: { name: string }[]) => {
  const newTagsString = tags
    .map((t) => t?.name)
    .sort()
    .join();
  const oldTagsString = oldTags
    .map((t) => t.name)
    .filter((t) => !t?.startsWith(TOPIC_PREFIX))
    .sort()
    .join();

  return newTagsString !== oldTagsString;
};
