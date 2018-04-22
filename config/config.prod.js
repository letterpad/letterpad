module.exports = {
    apiUrl: (function() {
        return typeof window !== "undefined"
            ? window.apiUrl
            : eval("process.env.apiUrl");
    })(),
    uploadUrl: (function() {
        return typeof window !== "undefined"
            ? window.uploadUrl
            : eval("process.env.uploadUrl");
    })(),
    rootUrl: (function() {
        return typeof window !== "undefined"
            ? window.rootUrl
            : eval("process.env.rootUrl");
    })(),
    appPort: (function() {
        return typeof window !== "undefined"
            ? window.appPort
            : eval("process.env.appPort");
    })(),
    apiPort: (function() {
        return typeof window !== "undefined"
            ? window.apiPort
            : eval("process.env.apiPort");
    })(),
    baseName: (function() {
        return typeof window !== "undefined"
            ? window.baseName
            : eval("process.env.baseName");
    })()
};
