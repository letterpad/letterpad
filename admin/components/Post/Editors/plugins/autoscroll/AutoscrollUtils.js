import getWindow from "get-window";

export const scrollTo = el => {
    const window = getWindow(el);
    const rect = el.getBoundingClientRect();
    const { innerWidth, innerHeight, pageYOffset, pageXOffset } = window;
    const top = rect.bottom + pageYOffset;
    const left = rect.right + pageXOffset;

    const x =
        left < pageXOffset || innerWidth + pageXOffset < left
            ? left - innerWidth / 2
            : pageXOffset;
    const y =
        top < pageYOffset || innerHeight + pageYOffset < top
            ? top - innerHeight / 2
            : pageYOffset;

    window.scrollTo(x, y + 40);
};
