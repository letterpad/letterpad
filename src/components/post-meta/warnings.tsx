import { Modal } from "antd";

export function warnNoTags() {
  Modal.warning({
    title: "Post not published",
    content: (
      <div>
        You have not added tags to your post. Add a tag/tags and ensure its set
        up in Settings → Navigation.
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

export function tagNotLinkedWithNavigation() {
  Modal.warning({
    title: "Post not published",
    content: (
      <div>
        You have not linked any tags of this post in Navigation. <br />
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
