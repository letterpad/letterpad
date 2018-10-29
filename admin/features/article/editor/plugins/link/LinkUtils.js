export const httpPreffixStrategy = href =>
  href.search("https?://") >= 0 ? href : `http://${href}`;
export const hasLinks = value =>
  value.inlines.some(inline => inline.type === "link");
export const getLink = value =>
  value.inlines.filter(inline => inline.type === "link").first();
export const createLink = data => ({ type: "link", data });
export const hasMultiBlocks = value => value.blocks.size > 1;

export const unlink = change => change.unwrapInline("link").focus();

export const updateLinkStrategy = ({
  change,
  data: { title, href, text, target },
}) => {
  const { value } = change;

  if (value.isCollapsed) {
    change.moveOffsetsTo(0, value.anchorText.characters.size);
  }

  change.insertText(text).setInline({
    type: "link",
    data: { title, href, text, target },
  });

  return change;
};
const wrapLink = (change, href) => {
  change.wrapInline({
    type: "link",
    data: { href },
  });

  change.collapseToEnd();
};
export const insertLinkStrategy = change => {
  const { value } = change;

  if (hasLinks(value)) {
    change.unwrapInline("link");
  } else if (value.isExpanded && !hasMultiBlocks(value)) {
    const href = window.prompt("Enter the URL of the link:");
    if (!href) return;
    change.call(wrapLink, href).focus();
    //change.wrapInline(createLink({ target: "_blank", openModal: true }));
  } else if (hasMultiBlocks(value)) {
    console.info("[SlateJS][LinkPlugin] has multiple blocks on selection");
  } else if (value.isCollapsed && !hasLinks(value)) {
    console.info(
      "[SlateJS][LinkPlugin] selection collapsed, w/o links on selection",
    );
  } else {
    const href = window.prompt("Enter the URL of the link:");
    const text = window.prompt("Enter the text for the link:");

    change
      .insertText(text)
      .extend(0 - text.length)
      .call(wrapLink, href);
  }

  return change;
};
