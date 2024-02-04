import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Drawer, Input, Switch, TextArea } from "ui";

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
import { ExcludeFromHome } from "./excludeFromHome";
import { Heading } from "./heading";
import { Preview } from "./preview";
import PublishButton from "./publishButton";
import { QuickMenu } from "./quickmenu";
import { SendEmailCheckbox } from "./sendEmailCheckbox";
import Tags from "./tags";
import { useUpdatePost } from "../../api.client";

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
                  rows={2}
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
                  key={!fetching ? +new Date() : null}
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
              {isPost && (
                <div>
                  <Heading
                    heading="Email Subscribers"
                    subheading={
                      <>
                        Notify your email subscribers when you publish this
                        post.
                      </>
                    }
                  />
                  <SendEmailCheckbox
                    mail_status={post.mail_status!}
                    post_status={post.status}
                    onChange={(mail_status) =>
                      debounceUpdatePost({
                        id: post.id,
                        mail_status,
                      })
                    }
                  />
                </div>
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
                  heading="Exclude this post from home page"
                  subheading={
                    "If you want to display this post under a different menu item, tag it with the menu item name and make sure, that tag is added in navigation menu"
                  }
                />
                <ExcludeFromHome
                  status={!!post.exclude_from_home}
                  onChange={(exclude_from_home) =>
                    debounceUpdatePost({
                      id: post.id,
                      exclude_from_home,
                    })
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
                  url={settings?.site_url! + slug}
                  excerpt={excerptRef.current?.value!}
                  image={post.cover_image.src}
                  siteTitle={settings?.site_title!}
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
