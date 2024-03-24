import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import React from "react";

import { useGetSettings } from "@/app/settings/_feature/api.client";
import { PageType } from "@/graphql/types";

import { QuickMenu } from "./quickmenu";

interface IProps {
  post: PostWithAuthorAndTagsFragment;
  setShowPostSetting: (show: boolean) => void;
}

const Actions = ({ post, setShowPostSetting }: IProps) => {
  const { data: settings } = useGetSettings();
  if (post.__typename !== "Post") return null;
  return (
    <>
      <QuickMenu
        showPreview={post.page_type !== PageType["Story Builder"]}
        siteUrl={settings?.site_url ?? ""}
        showDrawer={() => setShowPostSetting(true)}
        id={post.id}
      />
    </>
  );
};

export default Actions;
