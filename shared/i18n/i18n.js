import i18n from "i18next";
import * as language from "./lang";

i18n.init({
    // lng: "en", // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
        en: language.en,
        fr: language.fr,
        pl: language.pl
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ","
    },

    react: {
        wait: true
    }
});

export default i18n;
