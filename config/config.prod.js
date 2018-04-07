export default {
    apiUrl: (() =>
        typeof window !== "undefined" ? window.apiUrl : process.env.apiUrl)(),
    uploadUrl: (() =>
        typeof window !== "undefined"
            ? window.uploadUrl
            : process.env.uploadUrl)(),
    rootUrl: (() =>
        typeof window !== "undefined" ? window.rootUrl : process.env.rootUrl)(),
    appPort: (() =>
        typeof window !== "undefined" ? window.appPort : process.env.appPort)(),
    apiPort: (() =>
        typeof window !== "undefined" ? window.apiPort : process.env.apiPort)(),
    baseName: (() =>
        typeof window !== "undefined"
            ? window.baseName
            : process.env.baseName)()
};
