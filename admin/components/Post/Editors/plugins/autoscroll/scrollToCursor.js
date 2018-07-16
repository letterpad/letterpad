const scrollToCursor = () => {
    setTimeout(() => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        let top = rect.top + window.pageYOffset - 200; // 200 - we will calculate this based on window height (50%)
        window.scrollTo(0, top);
    }, 100);
};

export default scrollToCursor;
