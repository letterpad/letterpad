import {
    Navigation,
    NavigationType,
    PostStatusOptions,
    PostTypes,
} from "letterpad-graphql";
import { useState } from "react";
import { Message } from "ui";

import { EventAction, track } from "@/track";

import { useGetPost, useUpdatePost } from "../../../api.client";

interface Props {
    postId: string;
    menu: Navigation[];
}

enum NotPublished {
    NoTags = "NoTags",
    TagsNotLinkedWithNav = "TagsNotLinkedWithNav",
    PageNotLinkedWithNav = "PageNotLinkedWithNav",
}

export const usePublish = ({ postId, menu }: Props) => {
    const [error, setError] = useState<NotPublished>();
    const { data: post } = useGetPost({ id: postId });
    const { updatePost, fetching } = useUpdatePost();

    const validateAndPublish = () => {
        const isPost = post?.type === PostTypes.Post;

        const navigationPages = getPagesFromMenu(menu);
        // const postTags = isTagsNode(post.tags) ? post.tags.rows : [];

        const navLinkedWithPages = navigationPages?.find(
            (page) => page === post?.slug?.replace("/page/", "").toLowerCase()
        );

        if (!navLinkedWithPages && !isPost) {
            setError(NotPublished.PageNotLinkedWithNav);
        } else {
            publishOrUnpublish(true);
        }
    };

    const publishOrUnpublish = async (active: boolean) => {
        const status = active
            ? PostStatusOptions.Published
            : PostStatusOptions.Draft;

        if (active) {
            track({
                eventAction: EventAction.Click,
                eventCategory: "post status",
                eventLabel: "publish",
            });
        }

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
        isPublished: post?.status === PostStatusOptions.Published,
        isDirty: post?.html !== post?.html_draft
    }
}



function getPagesFromMenu(menu: Navigation[]) {
    return menu
        .filter((a) => a.type === NavigationType.Page)
        .map((a) => a.slug.replace("/page/", "").toLowerCase());
}
