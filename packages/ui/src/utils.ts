export const disableScroll = (flag: boolean) => {
  if (flag) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
  }
};
