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

  const { updatePost } = useUpdatePost();

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
          field: 'excerpt'
        }),
      });
      const text = await response.text();
      debounceUpdatePost({ excerpt: text, id: post.id });
      excerptRef.current.value = text;
    } catch (e) { }
    setBusy(false);
  }

  return (
    <>
      <QuickMenu
        showPreview={post.page_type !== PageType["Story Builder"]}
        siteUrl={settings?.site_url ?? ""}
        postHash={postHash}
        showDrawer={showDrawer}
        id={post.id}
      />
      <Drawer show={visible} title="Settings" onClose={onClose} dir="right">
        <div className="space-y-10 whitespace-normal">
          <PublishButton postId={post.id} menu={settings?.menu ?? []} />
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
          <div>
            <Heading
              heading={`${postVerb} Description`}
              subheading={`This will be used in displaying your post in your feed, in SEO and
              when sharing in social media.`}
            />
            <TextArea
              rows={4}
              maxLength={160}
              onChange={(e) => {
                debounceUpdatePost({ excerpt: e.target.value, id: post.id });
              }}
              ref={excerptRef}
              defaultValue={post.excerpt}
            />
            <div className="mt-2">{busy ? <CgSpinner className="animate-spin w-5 h-5" /> : <Link href="#" onClick={generateExcerpt}>Generate ✨</Link>}</div>
          </div>
          <div>
            <Heading heading="Path" subheading={""} />
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
              label="The URL of your post. Should contain only letters, numbers or hyphen (-) "
              onEnter={() => formatSlug(slug)}
              data-testid="slugInp"
            />
          </div>
          {isPost && (
            <Tags
              post={post}
              header={
                <Heading
                  heading="Tags"
                  subheading={
                    <>
                      Tags are used to group your posts together. Without tags,
                      your post wont be visible in your blog. Add a tag and
                      ensure its linked with navigation.{" "}
                      <a href="https://docs.letterpad.app/navigation-menu">
                        Learn more
                      </a>
                    </>
                  }
                />
              }
            />
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Actions;

const Heading = ({ heading, subheading }) => {
  return (
    <>
      <label className="font-bold">{heading}</label>
      <p className="help-text mb-4 mt-2">{subheading}</p>
    </>
  );
};
