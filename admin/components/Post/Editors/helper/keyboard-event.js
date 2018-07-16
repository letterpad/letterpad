export const isMod = event =>
    (event.metaKey && !event.ctrlKey) || event.ctrlKey;
