import { useEffect } from "react";


const ESCAPE_KEY = 27;

export const useEscapeKey = (callback: any) => {
    useEffect(() => {
        if (!window || !window.document || !callback) {
            return;
        }

        const onKeyPress = (event: any) => {
            if (event.keyCode === ESCAPE_KEY) {
                debugger;
                callback(event);
            }
        }
        window.document.addEventListener('keydown', onKeyPress);
        return () => {
            window.document.removeEventListener('keydown', onKeyPress);
        };
    }, [callback]);
};
