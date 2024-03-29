import { PostTypes, PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Drawer } from "ui";

import { useGetSettings } from "@/app/settings/_feature/api.client";

import { Dates } from "./dates";
import { Excerpt } from "./excerpt";
import { ExcludeFromHome } from "./excludeFromHome";
import { Preview } from "./preview";
import PublishButton from "./publish/publishButton";
import { SendEmailCheckbox } from "./sendEmailCheckbox";
import { Slug } from "./slug";
import { PrimaryTag, Tags } from "./tags";
import { useUpdatePost } from "../../api.client";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  visible: boolean;
  onClose: () => void;
}

export const PostSettingsModal = ({ visible, onClose }: IProps) => {
  const { getValues } = useFormContext<PostWithAuthorAndTagsFragment>();
  const post = getValues();
  const { data: settings } = useGetSettings();
  const [slug, setSlug] = useState(post.slug || "");

  const { fetching } = useUpdatePost();

  useEffect(() => {
    if (post.slug) setSlug(post.slug);
  }, [post.slug]);

  const isPost = post.type === PostTypes.Post;

  return (
    <>
      <Drawer
        show={visible}
        title="Settings"
        onClose={onClose}
        dir="top"
        className="w-screen z-20 bg-white h-screen"
      >
        <div className="whitespace-normal lg:w-2/3 m-auto">
          <div className="flex flex-col-reverse md:flex-row gap-10">
            <div className="flex-1 space-y-10">
              <Excerpt />
              {isPost && <PrimaryTag />}
              {isPost && (
                <Tags key={!fetching ? +new Date() : null} post={post} />
              )}
              {isPost && <SendEmailCheckbox />}
              <PublishButton postId={post.id} menu={settings?.menu ?? []} />
            </div>
            <div className="flex-1  space-y-10">
              <Slug />
              {isPost && <ExcludeFromHome />}
              <Preview
                url={settings?.site_url! + slug}
                siteTitle={settings?.site_title!}
              />

              <Dates />
            </div>
          </div>
          <div />
        </div>
      </Drawer>
    </>
  );
};
