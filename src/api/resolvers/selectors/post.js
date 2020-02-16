export const getMenuItemFromSlug = (arr, slug, type) => {
  return arr.find(item => {
    if (item.slug && item.slug === slug && item.type === type) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      getMenuItemFromSlug(item.children, slug);
    }
  });
};
