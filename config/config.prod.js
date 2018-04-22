module.exports = {
    apiUrl: (function() {
        return typeof window !== "undefined"
            ? window.apiUrl
            : process.env.apiUrl;
    })(),
    uploadUrl: (function() {
        return typeof window !== "undefined"
            ? window.uploadUrl
            : process.env.uploadUrl;
    })(),
    rootUrl: (function() {
        return typeof window !== "undefined"
            ? window.rootUrl
            : process.env.rootUrl;
    })(),
    appPort: (function() {
        return typeof window !== "undefined"
            ? window.appPort
            : process.env.appPort;
    })(),
    apiPort: (function() {
        return typeof window !== "undefined"
            ? window.apiPort
            : process.env.apiPort;
    })(),
    baseName: (function() {
        return typeof window !== "undefined"
            ? window.baseName
            : process.env.baseName;
    })()
};
