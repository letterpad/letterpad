import {
    Navigation,
    NavigationType,
    PostStatusOptions,
    PostTypes,
    PostWithAuthorAndTagsFragment,
} from "letterpad-graphql";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Message } from "ui";

import { EventAction, EventCategory, EventLabel, track } from "@/track";

import { useUpdatePost } from "../../../api.client";

interface Props {
    postId: string;
    menu: Navigation[];
}

enum NotPublished {
    NoTags = "NoTags",
    TagsNotLinkedWithNav = "TagsNotLinkedWithNav",
    PageNotLinkedWithNav = "PageNotLinkedWithNav",
}

export const usePublish = ({ menu }: Props) => {
    const [error, setError] = useState<NotPublished>();
    const path = usePathname();
    const { watch, setValue } = useFormContext<PostWithAuthorAndTagsFragment>();
    const { updatePost, fetching } = useUpdatePost();
    const type = watch("type");
    const postId = watch("id");
    const slug = watch("slug");
    const status = watch("status");
    const isDirty = watch("html") !== watch("html_draft");

    const validateAndPublish = () => {

        const navigationPages = getPagesFromMenu(menu);

        const navLinkedWithPages = navigationPages?.find(
            (page) => page === slug?.replace("/page/", "").toLowerCase()
        );

        // TODO: Fix this. 

        // if (!navLinkedWithPages && !isPost && path !== "/creatives") {
        //     setError(NotPublished.PageNotLinkedWithNav);
        // } else {
        //     return publishOrUnpublish(true);
        // }

        return publishOrUnpublish(true);
    };

    const publishOrUnpublish = async (active: boolean) => {
        const status = active
            ? PostStatusOptions.Published
            : PostStatusOptions.Draft;

        track({
            eventAction: EventAction.Click,
            eventCategory: EventCategory.PostStatus,
            eventLabel: active ? EventLabel.Published : EventLabel.Draft,
        });
        setValue("status", status);
        return await updatePost({ id: postId, status })
    };

    const _discardDraft = async () => {
        const res = await fetch("/api/discardDraft", {
            method: "POST",
            body: JSON.stringify({ id: postId }),
        });
        if (res.status === 200) {
            Message().success({ content: "Draft discarded successfully" });
            setTimeout(() => {
                document.location.reload();
            }, 0);
        }
    };
    return {
        error,
        validateAndPublish,
        publishOrUnpublish,
        _discardDraft,
        fetching,
        isPublished: status === PostStatusOptions.Published,
        isDirty
    }
}



function getPagesFromMenu(menu: Navigation[]) {
    return menu
        .filter((a) => a.type === NavigationType.Page)
        .map((a) => a.slug.replace("/page/", "").toLowerCase());
}
