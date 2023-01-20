import Link from "next/link";
import { FC } from "react";

export const WarnNoTags = () => {
  return (
    <div>
      You have not added tags to your post. Add a tag/tags and ensure its linked
      with Navigation Menu by visiting{" "}
      <Link href="/settings?selected=navigation">
        <a className="text-blue-500 hover:text-blue-700">
          Settings → Navigation
        </a>
      </Link>
      . This is necessary for your post to be visible in your website.
      <br />
      <a
        target="_blank"
        href="https://docs.letterpad.app/publishing/grouping-posts#setup-navigation-menu-to-display-the-tag"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Click here
      </a>{" "}
      to know more.
    </div>
  );
};

export const TagNotLinkedWithNavigation: FC<{ tags: string[] }> = ({
  tags,
}) => {
  const hasTags = tags.length > 0;
  const tagsCount = tags.length;
  const plural = tagsCount > 1;
  const tagsStr = tags.join(", ");

  return (
    <div>
      Atleast one tag of this post should be linked in Navigation. <br />
      <br />
      {hasTags && (
        <p>
          Currently the navigation menu has {plural ? "these tags" : "the tag"}{" "}
          - <strong className="italic">{tagsStr}</strong>. You need to link one
          of the tag from this Post to the Navigation Menu so that this post is
          visible in your website. You can do so by going to{" "}
          <Link href="/settings?selected=navigation">
            <a className="text-blue-500 hover:text-blue-700">
              Settings → Navigation
            </a>
          </Link>{" "}
          → New. Then give a name and select a tag by clicking content.
        </p>
      )}
      <br />
      <a
        target="_blank"
        href="https://docs.letterpad.app/navigation-menu"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Click here
      </a>{" "}
      to know more.
    </div>
  );
};

export const PageNotLinkedWithNavigation = () => {
  return (
    <div>
      This page has has not been linked with Navigation. Without linking, the
      page wont be displayed in your blog.
      <br />
      You can link this page by going to{" "}
      <Link href="/settings?selected=navigation">
        <a className="text-blue-500 hover:text-blue-700">
          Settings → Navigation
        </a>
      </Link>{" "}
      → New. Then give a name and select this page by clicking Content.
      <br />
      <a
        target="_blank"
        href="https://docs.letterpad.app/navigation-menu"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Click here
      </a>{" "}
      to know more.
    </div>
  );
};
