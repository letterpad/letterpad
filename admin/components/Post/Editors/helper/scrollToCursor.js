const scrollToCursor = () => {
    // some cases like image, we will fire the event even before the image has entered the dom.
    // so give a timeout of 100ms before scrolling
    setTimeout(() => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        let top = rect.top + window.pageYOffset - window.innerHeight / 2;
        window.scrollTo(0, top);
    }, 50);
};

export default scrollToCursor;
