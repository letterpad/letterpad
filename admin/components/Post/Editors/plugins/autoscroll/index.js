import scrollTo from "../../helper/scrollTo";

const AutoScrollPlugin = () => {
    return {
        onKeyDown(event, data, change) {
            if (event.key !== "Enter") return;
            event.preventDefault();
            const block = change.value.blocks.get(0);

            const el = document.querySelector(`[data-key="${block.key}"]`);
            scrollTo(el);
        }
    };
};

export { AutoScrollPlugin };
