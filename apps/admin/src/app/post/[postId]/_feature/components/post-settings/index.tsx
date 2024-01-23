import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Drawer, Input, Switch, TextArea } from "ui";
import { CgSpinner } from "react-icons/cg";
import { PostTypes } from "@/__generated__/__types__";
import { PostWithAuthorAndTagsFragment } from "@/__generated__/queries/partial.graphql";
import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";
import { debounce } from "@/shared/utils";
import {
  createPathWithPrefix,
  getLastPartFromPath,
  textToSlug,
} from "@/utils/slug";

import { getPostHash } from "./api";
import PublishButton from "./publishButton";
import { QuickMenu } from "./quickmenu";
import Tags from "./tags";
import { useUpdatePost } from "../../api.client";
import Link from "next/link";
import { Heading } from "./heading";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
}

const Actions = ({ post }: IProps) => {
  const [visible, setVisible] = useState(false);
  const [postHash, setPostHash] = useState("");
  const excerptRef = useRef<HTMLTextAreaElement>(null);

  const { data: settings } = useGetSettings();
  const [slug, setSlug] = useState(post.slug || "");
  const [busy, setBusy] = useState(false);

  const { updatePost, fetching } = useUpdatePost();

  const debounceUpdatePost = useMemo(
    () => debounce((data) => updatePost(data), 500),
    [updatePost]
  );

  useEffect(() => {
    getPostHash(post.id).then(setPostHash);
  }, [post.id]);

  useEffect(() => {
    if (post.slug) setSlug(post.slug);
  }, [post.slug]);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const formatSlug = (slug: string) => {
    const formattedSlug = createPathWithPrefix(
      textToSlug(getLastPartFromPath(slug)),
      post.type
    );
    setSlug(formattedSlug);
    debounceUpdatePost({ id: post.id, slug: formattedSlug });
  };

  if (post.__typename !== "Post") return null;

  const isPost = post.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";

  const generateExcerpt = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      if (!excerptRef.current) return;
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
          field: "excerpt",
        }),
      });
      const text = await response.text();
      debounceUpdatePost({ excerpt: text, id: post.id });
      excerptRef.current.value = text;
    } catch (e) {}
    setBusy(false);
  };

  return (
    <>
      <QuickMenu
        showPreview={post.page_type !== PageType["Story Builder"]}
        siteUrl={settings?.site_url ?? ""}
        postHash={postHash}
        showDrawer={showDrawer}
        id={post.id}
      />
      <Drawer
        show={visible}
        title="Settings"
        onClose={onClose}
        dir="top"
        className="w-screen"
        scale={true}
      >
        <div className="whitespace-normal lg:w-2/3 m-auto">
          <div className="flex flex-col-reverse md:flex-row gap-10">
            <div className="flex-1 space-y-10">
              <div>
                <Heading
                  heading={`${postVerb} Meta`}
                  subheading={`Used in search engines and social media.`}
                />
                <TextArea
                  rows={4}
                  maxLength={160}
                  onChange={(e) => {
                    debounceUpdatePost({
                      excerpt: e.target.value,
                      id: post.id,
                    });
                  }}
                  ref={excerptRef}
                  defaultValue={post.excerpt}
                />
                <div className="mt-2">
                  {busy ? (
                    <CgSpinner className="animate-spin w-5 h-5" />
                  ) : (
                    <Link href="#" onClick={generateExcerpt}>
                      Generate ✨
                    </Link>
                  )}
                </div>
              </div>
              {isPost && (
                <Tags
                  post={post}
                  header={
                    <Heading
                      heading="Tags"
                      subheading={
                        <>
                          Add or change tags (up to 5) so readers can discover
                          your posts and know what your story is about.
                        </>
                      }
                    />
                  }
                />
              )}
              <PublishButton postId={post.id} menu={settings?.menu ?? []} />
            </div>
            <div className="flex-1  space-y-10">
              <div>
                <Heading
                  heading="Path"
                  subheading={
                    "The URL of your post. Should contain only letters, numbers or hyphen (-) "
                  }
                />
                <Input
                  onChange={(e) => setSlug(e.target.value)}
                  value={getLastPartFromPath(slug)}
                  addonBefore={`/${post.type}/`}
                  addonAfter={
                    <a
                      className="cursor-pointer text-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        formatSlug(slug);
                      }}
                    >
                      Validate
                    </a>
                  }
                  onEnter={() => formatSlug(slug)}
                  data-testid="slugInp"
                  help={
                    <span className="dark:text-white">
                      {fetching ? "Checking..." : <span>&nbsp;</span>}
                    </span>
                  }
                />
              </div>
              <div>
                <Heading
                  heading="Story Preview"
                  subheading={
                    "This is how various search engines and social posting will look like."
                  }
                />
                <Preview
                  title={post.title}
                  url={settings?.site_url! + "/" + slug}
                  excerpt={excerptRef.current?.value}
                  image={post.cover_image.src}
                />
              </div>
            </div>
          </div>

          <div />

          <div
            className={classNames({
              hidden: true || !isPost,
            })}
          >
            <Switch
              label="Featured"
              active={post.featured}
              onChange={(change) => {
                debounceUpdatePost({
                  id: post.id,
                  featured: change,
                });
              }}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Actions;

const Preview = ({ title, url, excerpt, image }) => {
  return (
    <>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-neutral-900 shadow-md rounded-md">
        {image && (
          <img
            src={image}
            alt="Search Result Image"
            className="mb-4 rounded-md h-36 w-full object-cover"
          />
        )}
        <div>
          <div className="font-bold">Ajaxtown</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="hover:underline">{url}</span>
          </p>
        </div>
        <h2 className="text-xl font-semibold text-blue-700 mt-2">
          <span className="hover:underline">{title}</span>
        </h2>

        <p className="text-gray-700 mt-2 dark:text-gray-300">{excerpt}</p>
      </div>
    </>
  );
};
