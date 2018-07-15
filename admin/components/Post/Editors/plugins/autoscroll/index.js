import * as AutoscrollUtils from "./AutoscrollUtils";

const AutoScrollPlugin = () => {
    return {
        onKeyDown(event, data, change) {
            if (event.key !== "Enter") return;
            event.preventDefault();
            const block = change.value.blocks.get(0);

            const el = document.querySelector(`[data-key="${block.key}"]`);
            AutoscrollUtils.scrollTo(el);
        },
        onChange(change) {
            const block = change.value.blocks.get(0);

            const el = document.querySelector(`[data-key="${block.key}"]`);
            if (!el) return;
            AutoscrollUtils.scrollTo(el);
        }
    };
};

export { AutoScrollPlugin, AutoscrollUtils };
