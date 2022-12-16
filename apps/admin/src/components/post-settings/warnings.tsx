import { Message } from "@/components_v2/message";

export function warnNoTags() {
  Message().warn({
    displayType: "modal",
    title: "Post not published",
    className: "no-tags-modal",
    content: (
      <div>
        You have not added tags to your post. Add a tag/tags and ensure its set
        up in Settings → Navigation. This is necessary for your post to be
        visible in your homepage.
        <p>
          <a
            target="_blank"
            href="https://docs.letterpad.app/publishing/grouping-posts#setup-navigation-menu-to-display-the-tag"
            rel="noreferrer"
          >
            Click here
          </a>{" "}
          to know more.
        </p>
      </div>
    ),
  });
}

export function tagNotLinkedWithNavigation(tags: string[]) {
  const hasTags = tags.length > 0;
  const tagsCount = tags.length;
  const plural = tagsCount > 1;
  const tagsStr = tags.join(", ");

  const message = `Currently the navigation menu has ${
    plural ? "these tags" : "this tag"
  } - ${tagsStr}. You should use a tag from above or create a new tag and link it in
        navigation menu. You can do so by going to Settings → Navigation → New.
        Then give a name and select a tag from the dropdown.`;

  Message().warn({
    displayType: "modal",
    title: "Post not published",
    className: "tags-notlinked-modal",
    content: (
      <div>
        Atleast one tag of this post should be linked in Navigation. <br />
        {hasTags && message}
        <p>
          <a
            target="_blank"
            href="https://docs.letterpad.app/navigation-menu"
            rel="noreferrer"
          >
            Click here
          </a>{" "}
          to know more.
        </p>
      </div>
    ),
  });
}

export function pageNotLinkedWithNavigation() {
  Message().warn({
    className: "page-link-modal", //used by cypress
    title: "Post not published",
    displayType: "modal",
    content: (
      <div>
        This page has has not been linked in Navigation. Without linking, the
        page wont be displayed in your blog.
        <br />
        You can link this page by going to Settings → Navigation → New. Then
        give a name and select this page from the dropdown.
        <p>
          <a
            target="_blank"
            href="https://docs.letterpad.app/navigation-menu"
            rel="noreferrer"
          >
            Click here
          </a>{" "}
          to know more.
        </p>
      </div>
    ),
  });
}
