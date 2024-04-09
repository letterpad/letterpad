import { PostTypes, PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { TextArea } from "ui";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { useGetProModal } from "@/components/get-pro-modal-provider";

import { EventAction, track } from "@/track";

import { Heading } from "./heading";

export const Excerpt = () => {
  const { register, setValue, getValues } =
    useFormContext<PostWithAuthorAndTagsFragment>();
  const [busy, setBusy] = useState(false);
  const isPaidMember = useIsPaidMember();
  const { setIsOpen } = useGetProModal();

  const generateExcerpt = async (e) => {
    e.preventDefault();
    if (!isPaidMember) {
      track({
        eventAction: EventAction.Click,
        eventCategory: "pro-modal",
        eventLabel: `excerpt`,
      });
      setIsOpen(true);
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
          field: "excerpt",
        }),
      });
      const text = await response.text();
      setValue("excerpt", text);
    } catch (e) {}
    setBusy(false);
  };

  const post = getValues();
  const isPost = post.type === PostTypes.Post;
  const postVerb = isPost ? "Post" : "Page";

  return (
    <div>
      <Heading
        heading={`${postVerb} Meta`}
        subheading={`Used in search engines and social media.`}
      />
      <TextArea
        rows={2}
        maxLength={160}
        defaultValue={post.excerpt! ?? post.sub_title}
        {...register("excerpt", {
          maxLength: 160,
        })}
        data-testid="excerpt"
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
  );
};
