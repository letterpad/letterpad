import { Modal } from "antd";

export function warnNoTags() {
  Modal.warning({
    className: "no-tags-modal", //used by cypress
    zIndex: 999999999,
    title: "Post not published",
    okButtonProps: {
      className: "okModalBtn",
    },
    content: (
      <div>
        You have not added tags to your post. Add a tag/tags and ensure its set
        up in Settings → Navigation. This is necessary for your post to be
        visible in your homepage.
        <p>
          <a
            target="_blank"
            href="https://docs.letterpad.app/publishing/grouping-posts#setup-navigation-menu-to-display-the-tag"
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
  Modal.warning({
    className: "tags-notlinked-modal", //used by cypress
    zIndex: 999999999,
    title: "Post not published",
    okButtonProps: {
      className: "okModalBtn",
    },
    content: (
      <div>
        Atleast one tag of this post should be linked in Navigation. <br />
        {tags.length > 0 &&
          `Currently the navigation menu has these tags - ${tags.join(", ")}`}
        You can do so by going to Settings → Navigation → New. Then give a name
        and select a tag from the dropdown.
        <p>
          <a target="_blank" href="https://docs.letterpad.app/navigation-menu">
            Click here
          </a>{" "}
          to know more.
        </p>
      </div>
    ),
  });
}

export function pageNotLinkedWithNavigation() {
  Modal.warning({
    className: "page-link-modal", //used by cypress
    zIndex: 999999999,
    title: "Post not published",
    content: (
      <div>
        This page has has not been linked in Navigation. Without linking, the
        page wont be displayed in your blog.
        <br />
        You can link this page by going to Settings → Navigation → New. Then
        give a name and select this page from the dropdown.
        <p>
          <a target="_blank" href="https://docs.letterpad.app/navigation-menu">
            Click here
          </a>{" "}
          to know more.
        </p>
      </div>
    ),
  });
}
